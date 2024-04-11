import firebase_admin
from flask import Flask, request, jsonify
from firebase_auth import auth
from flask_cors import CORS
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('lifehappens-293da-firebase-adminsdk-77os9-bdebc62647.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


#user passwords are all 123456
# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    try:
        print("HERE")
        email = request.json.get('email')
        password = request.json.get('password')
        print(email, password)
        user = auth.create_user_with_email_and_password(email, password)

        # find way to print out user id, then store ids in doc
        return jsonify({'message': 'Signup successful'})
    except Exception as e:
        print(str(e))
        print(request.data.decode())
        return jsonify({'error': str(e)}), 400

# Login route
@app.route('/login', methods=['POST'])
def login():
    print("HERE")
    email = request.form['email']
    password = request.form['password']
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        return jsonify({'message': 'Login successful'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Dummy data route  
@app.route('/data')
def get_time():
    # Returning dummy data
    return {
        'Name': "geek",
        "Age": "22",
        "Date": 'x',
        "programming": "python"
    }



def get_task_by_user_and_task_id(user_id, task_id):
    try:
        # Navigating to the Task document within the User subcollection
        task_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id)
        task = task_ref.get()
        if task.exists:
            return task.to_dict()
        else:
            return None
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Route to get a specific task for a user
@app.route('/user/<user_id>/task/<task_id>', methods=['GET'])
def get_user_task(user_id, task_id):
    task = get_task_by_user_and_task_id(user_id, task_id)
    if task:
        return jsonify(task), 200
    else:
        return jsonify({'error': 'Task not found'}), 404
# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
