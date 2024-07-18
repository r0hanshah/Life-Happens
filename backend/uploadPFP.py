from flask import Flask, request, render_template, redirect, url_for, session
import firebase_admin
from firebase_admin import credentials, firestore, storage
import pyrebase
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # Replace with a random secret key

# Firebase Admin SDK initialization
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'lifehappens-293da.appspot.com'
})
db = firestore.client()
bucket = storage.bucket()

# Pyrebase initialization
firebaseConfig = {
    'apiKey': "AIzaSyBgDOWWLjlJXgWRtN_hkBk4InUCr6QqHng",
    'authDomain': "lifehappens-293da.firebaseapp.com",
    'projectId': "lifehappens-293da",
    'storageBucket': "lifehappens-293da.appspot.com",
    'messagingSenderId': "482058299460",
    'appId': "1:482058299460:web:92eff3955d7cf348c33411",
    'measurementId': "G-XDMYBRH5SV",
    'databaseURL': "https://lifehappens-293da-default-rtdb.firebaseio.com/"
}

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

@app.route('/')
def home():
    if 'user_id' in session:
        user_id = session['user_id']
        return render_template('index.html', user_id=user_id)
    return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        name = request.form.get('name')

        try:
            user = auth.create_user_with_email_and_password(email, password)
            user_id = user['localId']
            # Save user to Firestore
            user_data = {
                "ID": user_id,
                "Name": name,
                "ProfilePicture": "https://example.com/default_profile.jpg",
                "TaskTreeRoots": [],
                "WeeklyAITimesAllowed": {},
                "Settings": {},
                "AllowAIMoveTasks": False,
                "SharedTaskTrees": [],
                "ParentsOfLeafNodesByTask": {}
            }
            db.collection('User').document(user_id).set(user_data)
            session['user_id'] = user_id
            return redirect(url_for('home'))
        except Exception as e:
            return str(e)

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        try:
            user = auth.sign_in_with_email_and_password(email, password)
            session['user_id'] = user['localId']
            return redirect(url_for('home'))
        except Exception as e:
            return str(e)

    return render_template('login.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    file = request.files['profile_pic']
    if user_id and file:
        blob = bucket.blob(f"Users/{user_id}/profile_pics")
        blob.upload_from_file(file, content_type=file.content_type)
        blob.make_public()

        # Update Firestore with the new profile picture URL
        user_ref = db.collection('User').document(user_id)
        user_ref.update({'ProfilePicture': blob.public_url})

        return redirect(url_for('home'))
    return 'Failed to upload image', 400

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
