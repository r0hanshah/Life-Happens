import firebase_admin
from flask import Flask, request, jsonify, render_template
from flask_mail import Mail, Message
from firebase_auth import auth
from flask_cors import CORS
from firebase_admin import credentials
from firebase_admin import firestore, storage
from task_funcs import add_task_to_firestore, edit_task_in_firestore,delete_task_in_firestore, upload_file_in_storage, delete_file_in_storage, get_files_from_storage, get_task_in_firestore

import base64

CRED = credentials.Certificate('./serviceAccountKey.json')
firebase_admin.initialize_app(CRED, {
    'storageBucket': 'lifehappens-293da.appspot.com'
})

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

BUCKET = storage.bucket()

# user passwords are all 123456
# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    try:
        print("HERE")
        email = request.json.get('email')
        password = request.json.get('password')
        name = request.json.get('name')
        username = request.json.get('username')
        print(email, password)
        user = auth.create_user_with_email_and_password(email, password)
        user_id = user['localId']
        print(user['localId'])
        try:
            msg = Message('Welcome to Life Happens!', recipients=[email])
            msg.body = 'Thank you for signing up! We hope you enjoy using our app.'
            mail.send(msg)
        except:
            print("Invalid email")

        data = {
            'ID': user_id,
            'Name': name,
            'ParentsOfLeafNodesByTask':[],
            'ProfilePicture':'',
            'Settings':[],
            'SharedTaskTrees':[],
            'TaskTreeRoots':[],
            'WeeklyAITimesAllowed':[]
        }

        db.collection('User').document(user_id).set(data)

        # find way to print out user id, then store ids in doc
        return jsonify(data)
    except Exception as e:
        print(str(e))
        print(request.data.decode())
        return jsonify({'error': str(e)}), 400


# Login route
@app.route('/login', methods=['POST'])
def login():
    print("HERE")
    data = request.json
    email = data.get('email')
    password = data.get('password')
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        print(user)
        return jsonify({'user_id': user['localId']})
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

####################################################################

@app.route('/addTask', methods=['POST'])
def add_task():
    try:
        req_data = request.json
        task_data = req_data.get('task')
        task_path_array = req_data.get('task_path_array')

        add_task_to_firestore(task_data, task_path_array, db)

        return jsonify({'message': 'Task added successfully'}), 201
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/editTask', methods=['PUT'])
def edit_task():
    try:
        req_data = request.json
        task_data = req_data.get('task')
        task_path_array = req_data.get('task_path_array')

        edit_task_in_firestore(task_data, task_path_array, db)

        return jsonify({'message': 'Task edited successfully'}), 201
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/fetchTask', methods=['POST'])
def fetch_task():
    try:
        print("Just got called...")

        req_data = request.json
        task_id = req_data.get('task_id')
        user_id = req_data.get('user_id')
        task_path_array = req_data.get('task_path_array')

        print("Loaded parameters...", task_id, task_path_array)

        data = get_task_in_firestore(task_id, user_id, task_path_array, db)

        print(data)

        return data, 201
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/deleteTask', methods=['DELETE'])
def delete_task():
    try:
        req_data = request.json
        task_data = req_data.get('task')
        task_path_array = req_data.get('task_path_array')

        delete_task_in_firestore(task_data, task_path_array, db)

        return jsonify({'message': 'Task deleted successfully'}), 201
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/getfile', methods=['POST'])
def get_file():
    try:
        if 'file_path' not in request.json:
                return 'No file path provided in the request', 400
        
        data = get_files_from_storage(BUCKET, request.json['file_path'])

        return jsonify(data), 200
    except Exception as e:
        print(f'Error getting file: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        # Check if 'file' exists in the request
        if 'file' not in request.json:
            return 'No file provided in the request', 400
        
        if 'task_path_array' not in request.json:
            return 'No task path provided in the request', 400
        
        if 'task_id' not in request.json:
            return 'No task id provided in the request', 400
        
        if 'user_id' not in request.json:
            return 'No user id provided', 400

        # Extract file data from the request
        file_data = request.json['file']
        task_path_array = request.json['task_path_array']
        task_id = request.json['task_id']
        user_id = request.json['user_id']

        # Decode the base64 data URI
        file_content = base64.b64decode(file_data['uri'].split(',')[1])

        # Generate a unique filename
        filename = file_data['name']

        upload_file_in_storage(file_content, filename, task_path_array, task_id, user_id, BUCKET)

        return 'File uploaded successfully', 200
    except Exception as e:
        print(f'Error uploading file: {str(e)}')
        return f'Error uploading file: {str(e)}', 500

@app.route('/deletefile', methods=['POST'])
def delete_file():
    try:
        # Check if 'file' exists in the request
        if 'filename' not in request.json:
            return 'No file provided in the request', 400
        
        if 'task_path_array' not in request.json:
            return 'No task path provided in the request', 400
        
        if 'task_id' not in request.json:
            return 'No task id provided in the request', 400
        
        if 'user_id' not in request.json:
            return 'No user id provided', 400

        # Extract file data from the request
        filename = request.json['filename']
        task_path_array = request.json['task_path_array']
        task_id = request.json['task_id']
        user_id = request.json['user_id']

        delete_file_in_storage(filename, task_path_array, task_id, user_id, BUCKET)

        return 'File uploaded successfully', 200
    except Exception as e:
        print(f'Error deleting file: {str(e)}')
        return f'Error uploading file: {str(e)}', 500
    
####################################################################


@app.route('/user/<user_id>/task/<task_id>', methods=['GET'])
def get_user_task(user_id, task_id):
    task = get_task_by_user_and_task_id(user_id, task_id)
    if task:
        return jsonify(task), 200
    else:
        return jsonify({'error': 'Task not found'}), 404

@app.route('/user', methods=['POST'])
def add_user():
    try:
        # Parse request data
        user_data = request.json

        # Generate a new document reference with a random unique ID
        new_user_ref = db.collection('User').document()

        # Set the new user data
        new_user_ref.set(user_data)

        # Retrieve the ID of the newly created document
        user_id = new_user_ref.id

        return jsonify({'message': 'User added successfully', 'userId': user_id}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# @app.route('/user/<user_id>/task/<task_id>', methods=['DELETE'])
# def delete_task(user_id, task_id):
#     try:
#         task_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id)
#         task_ref.delete()
#         return jsonify({'message': 'Task deleted successfully'}), 200
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return jsonify({'error': str(e)}), 500


@app.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # First, delete all tasks in the 'Tasks' subcollection
        # tasks_ref = db.collection('User').document(user_id).collection('Tasks')
        # tasks = tasks_ref.stream()
        # for task in tasks:
        #     tasks_ref.document(task.id).delete()

        # Now, delete the user document
        user_ref = db.collection('User').document(user_id)
        user_ref.delete()

        return jsonify({'message': 'User and all associated tasks deleted successfully'}), 200
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

    return AIFunctions().generate_tasks(context, start_date_iso_string, end_date_iso_string, pre_existing_subtasks,
                                        file_paths)


@app.route('/user/<user_id>/task/<task_id>', methods=['PUT'])
def update_task(user_id, task_id):
    try:
        task_data = request.json
        task_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id)
        task_ref.update(task_data)
        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_ref = db.collection('User').document(user_id)
        user = user_ref.get()
        if user.exists:
            return jsonify(user.to_dict()), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        # Parse request data
        user_updates = request.json

        # Get a reference to the existing user document
        user_ref = db.collection('User').document(user_id)

        # Update the user document with the new data
        user_ref.update(user_updates)

        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler


# this will run every time a task is created and schedule the email notifications for 24 hrs before the due date
def schedule_due_task_reminder(user_id, task_id, due_date):
    try:
        # Calculate reminder date (24 hours before due date)
        reminder_date = due_date - timedelta(days=1)

        # Schedule email reminder
        scheduler = BackgroundScheduler()
        scheduler.add_job(send_due_task_email, 'date', run_date=reminder_date, args=[user_id, task_id])
        scheduler.start()

        print('Task reminder scheduled successfully.')
    except Exception as e:
        print(f"An error occurred while scheduling task reminder: {e}")


# this function is called automatically by the scheduler
def send_due_task_email(user_id, task_id):
    try:
        # Retrieve user's email and task name from Firestore
        task_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id)
        task_data = task_ref.get().to_dict()
        user_email = db.collection('User').document(user_id).get().get('email')
        task_name = task_data.get('name')

        # Send email to user
        msg = Message('Reminder: Task Due Soon', recipients=[user_email])
        msg.body = f'Hi there!\n\nThis is a reminder that your task "{task_name}" is due soon.'
        mail.send(msg)

        print('Task reminder email sent successfully.')
    except Exception as e:
        print(f"An error occurred while sending task reminder email: {e}")


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
