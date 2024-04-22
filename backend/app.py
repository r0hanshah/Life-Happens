import firebase_admin
from flask import Flask, request, jsonify, render_template
from flask_mail import Mail, Message
from firebase_auth import auth
from flask_cors import CORS
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

db = firestore.client()
from ai_funcs import AIFunctions

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'lifehappensnotif@gmail.com'
app.config['MAIL_PASSWORD'] = 'pzyilmwlsyohszip'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = 'lifehappensnotif@gmail.com'

mail = Mail(app)



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
        msg = Message('Welcome to Life Happens!', recipients=[email])
        msg.body = 'Thank you for signing up! We hope you enjoy using our app.'
        mail.send(msg)

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
    




# Assume a function in your model (TaskModel.py or similar)
def add_task_to_firestore(user_id, task_data):
    # Add the task to Firestore under the user's tasks collection
    task_ref = db.collection('User').document(user_id).collection('Tasks').document()
    task_ref.set(task_data)
    return task_ref.id  # Returns the newly created task's ID



@app.route('/user/<user_id>/task', methods=['POST'])
def add_task(user_id):
    try:
        task_data = request.json
        new_task_id = add_task_to_firestore(user_id, task_data)
        return jsonify({'message': 'Task added successfully', 'taskId': new_task_id}), 201
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/user/<user_id>/task/<task_id>', methods=['DELETE'])
def delete_task(user_id, task_id):
    try:
        task_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id)
        task_ref.delete()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500



# AI backend
@app.route('/generate', methods=['POST'])
def generateTasks():
    print(request.json)
    # return []
    data = request.json
    context = data.get('contextText')
    start_date_iso_string = data.get('start')
    end_date_iso_string = data.get('end')
    pre_existing_subtasks = data.get('subtasks')
    file_paths = data.get('files')

    return AIFunctions().generate_tasks(context, start_date_iso_string, end_date_iso_string, pre_existing_subtasks, file_paths)



# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
