import firebase_admin
from flask import Flask, request, jsonify, render_template, make_response, session
from flask_mail import Mail, Message
from flask_session import Session
from firebase_auth import auth
from flask_cors import CORS
from firebase_admin import credentials
from firebase_admin import firestore, storage
from firebase_admin import auth as TEMP_AUTH
from task_funcs import add_task_to_firestore, edit_task_in_firestore,delete_task_in_firestore, upload_file_in_storage, delete_file_in_storage, get_files_from_storage, get_task_in_firestore
import base64
# below for persistent login
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps

CRED = credentials.Certificate('./serviceAccountKey.json')
firebase_admin.initialize_app(CRED, {
    'storageBucket': 'lifehappens-293da.appspot.com'
})

db = firestore.client()
from ai_funcs import AIFunctions

SECRET_KEY = 'your_secret_key'

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
app.secret_key = SECRET_KEY
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'lifehappensnotif@gmail.com'
app.config['MAIL_PASSWORD'] = 'pzyilmwlsyohszip'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_DEFAULT_SENDER'] = 'lifehappensnotif@gmail.com'

mail = Mail(app)

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

BUCKET = storage.bucket()

# user passwords are all 123456
# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    try:
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
            'WeeklyAITimesAllowed':[],
            'RestPeriods':[],
            'Nodes':{},
        }

        db.collection('Users').document(user_id).set(data)

        # find way to print out user id, then store ids in doc
        return jsonify(data)
    except Exception as e:
        print(str(e))
        print(request.data.decode())
        return jsonify({'error': str(e)}), 400

@app.route('/verify-login', methods=['GET'])
def verify_login():
    print("Just got called")
    token = request.headers.get('Authorization')
    print(token)
    if not token:
        return jsonify({"logged_in": False, "error": "No token provided"}), 401

    try:
        # Decode the token
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"logged_in": True, "user_id": decoded_token['user_id'], "email": decoded_token['email']}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"logged_in": False, "error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"logged_in": False, "error": "Invalid token"}), 401

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        user = auth.sign_in_with_email_and_password(email, password)

        token_payload = {
            "user_id": user['localId'],
            "email": email,
            "exp": datetime.utcnow() + timedelta(days=365),  # Token valid for 365 days
        }
        token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

        return jsonify({'user_id': user['localId'], 'token':token})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/verify-token', methods=['POST'])
def verify_user_token():
    data = request.json
    token = data.get('token')
    user_id = verify_token(token)
    if user_id:
        user_ref = db.collection('Users').document(user_id)
        user = user_ref.get()
        if user.exists:
            return jsonify({'user_id': user_id, 'user': user.to_dict()})
        else:
            return jsonify({'error': 'User not found'}), 404
    else:
        return jsonify({'error': 'Invalid or expired token'}), 401

def generate_token(user_id):
    expiration = datetime.now(timezone.utc) + timedelta(days=7)
    token = jwt.encode({'user_id': user_id, 'exp': expiration}, SECRET_KEY, algorithm='HS256')
    return token

def verify_token(token):
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        print(f"Token decoded: {data}")
        return data['user_id']
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None    

    

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            current_user = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid!'}), 403
        
        return f(current_user, *args, **kwargs)
    
    return decorated

@app.route('/protected', methods=['GET'])
@token_required
def protected_route(current_user):
    return jsonify({'message': 'This is a protected route', 'user': current_user})
### persistent login above


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
        task_ref = db.collection('Users').document(user_id).collection('Tasks').document(task_id)
        task = task_ref.get()
        
        if task.exists:
            task_dict = task.to_dict()
            
            # Check if the task_ref has a 'Tasks' collection
            children_ref = task_ref.collection('Tasks')
            print(children_ref)
            children_docs = children_ref.stream()
            print(children_docs)
            
            # If it does, add all the document IDs to the 'Children' field of the task_dict
            task_dict['Children'] = [child.id for child in children_docs]
            
            return task_dict
        else:
            return None
    except Exception as e:
        print(f"Error retrieving task: {e}")
        return None

@app.route('/addTask', methods=['POST'])
def add_task():
    try:
        req_data = request.json
        user_id = req_data.get('user_id')
        task_data = req_data.get('task')
        task_path_array = req_data.get('task_path_array')

        if not user_id or not task_data:
            return jsonify({'error': 'Invalid data'}), 400

        task_id = add_task_to_firestore(user_id, task_data, task_path_array, db)
        schedule_due_task_reminder(user_id, task_id, task_data['EndDate'], task_data['StartDate'])
        
        return jsonify({'message': 'Task added successfully', 'task_id': task_id}), 201
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500


# def add_task_to_firestore(user_id, task_data):
#     try:
#         task_ref = db.collection('Users').document(user_id).collection('Tasks').document()
        
#         # Convert ISO formatted date strings to datetime objects
#         task_data['EndDate'] = datetime.fromisoformat(task_data['EndDate'].replace('Z', '+00:00'))
#         task_data['StartDate'] = datetime.fromisoformat(task_data['StartDate'].replace('Z', '+00:00'))
        
#         task_ref.set(task_data)
#         return task_ref.id
#     except Exception as e:
#         print(f"An error occurred while adding task to Firestore: {e}")
#         raise

def schedule_due_task_reminder(user_id, task_id, end_date, start_date):
    # Placeholder for the email notification scheduler function
    pass

# Route to get a specific task for a user

####################################################################

# @app.route('/addTask', methods=['POST'])
# def add_task():
#     try:
#         req_data = request.json
#         task_data = req_data.get('task')
#         task_path_array = req_data.get('task_path_array')

#         add_task_to_firestore(task_data, task_path_array, db)

#         # Assume a function in your model (TaskModel.py or similar)
#         def add_task_to_firestore(user_id, task_data):
#             # Add the task to Firestore under the user's tasks collection
#             task_ref = db.collection('User').document(user_id).collection('Tasks').document()
#             task_data['EndDate'] = datetime.strptime(task_data['EndDate'], '%Y-%m-%d').date() #not sure if this line works to get the due date
#             task_data['StartDate'] = datetime.strptime(task_data['StartDate'], '%Y-%m-%d').date()
#             task_ref.set(task_data)

#         schedule_due_task_reminder(user_id, task_ref.id, task_data['EndDate'], task_data['StartDate']) #calling the email notification scheduler for task
#         return jsonify({'message': 'Task added successfully'}), 201
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return jsonify({'error': str(e)}), 500

@app.route('/editTask', methods=['PUT'])
def edit_task():
    try:
        req_data = request.json
        task_data = req_data.get('task')
        task_path_array = req_data.get('task_path_array')

        if not task_data:
            return jsonify({'error': 'Missing task data'}), 400
        # if not task_path_array:
        #     return jsonify({'error': 'Missing task path array'}), 400

        edit_task_in_firestore(task_data, task_path_array, db)

        return jsonify({'message': 'Task edited successfully'}), 200
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
        if data:
            return data, 201
        else:
            raise Exception(f"Failed to fetch task: {task_id} (It might not exist)")
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
    print("LOADED TASK:",task)
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
        new_user_ref = db.collection('Users').document()

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
#         task_ref = db.collection('Users').document(user_id).collection('Tasks').document(task_id)
#         task_ref.delete()
#         return jsonify({'message': 'Task deleted successfully'}), 200
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         return jsonify({'error': str(e)}), 500


@app.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # First, delete all tasks in the 'Tasks' subcollection
        # tasks_ref = db.collection('Users').document(user_id).collection('Tasks')
        # tasks = tasks_ref.stream()
        # for task in tasks:
        #     tasks_ref.document(task.id).delete()
        TEMP_AUTH.delete_user(user_id)

        # Now, delete the user document
        user_ref = db.collection('Users').document(user_id)
        user_ref.delete()

        return jsonify({'message': 'User and all associated tasks deleted successfully'}), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/user/<user_id>/save_rest_periods', methods=['POST'])
def save_rest_periods(user_id):
    try:
        data = request.json
        rest_periods = data.get('rest_periods')

        user_ref = db.collection('Users').document(user_id)
        user_ref.update({f"RestPeriods": rest_periods})
        return jsonify({'message', 'Rest periods saved successfully.'})
    
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500


# AI backend
@app.route('/generate', methods=['POST'])
def generateTasks():
    print(request.json)
    # return []
    data = request.json
    task_name = data.get('taskName')
    context = data.get('contextText')
    start_date_iso_string = data.get('start')
    end_date_iso_string = data.get('end')
    pre_existing_subtasks = data.get('subtasks')
    file_paths = data.get('files')

    return AIFunctions().generate_tasks(task_name, context, start_date_iso_string, end_date_iso_string, pre_existing_subtasks,
                                        file_paths)


@app.route('/user/<user_id>/task/<task_id>', methods=['PUT'])
def update_task(user_id, task_id):
    try:
        task_data = request.json
        task_ref = db.collection('Users').document(user_id).collection('Tasks').document(task_id)
        task_ref.update(task_data)
        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_ref = db.collection('Users').document(user_id)
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
        user_ref = db.collection('Users').document(user_id)

        # Update the user document with the new data
        user_ref.update(user_updates)

        return jsonify({'message': 'User updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


from datetime import datetime, timedelta
from apscheduler.schedulers.background import BackgroundScheduler

#this will run every time a task is created and schedule the email notifications for 24 hrs before the due date
def schedule_due_task_reminder(user_id, task_id, due_date, start_date):
    try:
        # Calculate due date reminder
        reminder_date = due_date

        # Schedule due date reminder
        scheduler = BackgroundScheduler()
        scheduler.add_job(send_due_task_email, 'date', run_date=reminder_date, args=[user_id, task_id])
        scheduler.start()

        # Calculate due date reminder
        reminder_date2 = start_date

        # Schedule due date reminder
        scheduler = BackgroundScheduler()
        scheduler.add_job(send_start_task_email, 'date', run_date=reminder_date2, args=[user_id, task_id])
        scheduler.start()

        print('Task reminder scheduled successfully.')
    except Exception as e:
        print(f"An error occurred while scheduling task reminder: {e}")


# this function is called automatically by the scheduler
def send_due_task_email(user_id, task_id):
    try:
        # Retrieve user's email and task name from Firestore
        task_ref = db.collection('Users').document(user_id).collection('Tasks').document(task_id)
        task_data = task_ref.get().to_dict()
        user_email = db.collection('Users').document(user_id).get().get('email')
        task_name = task_data.get('name')

        # Send email to user
        msg = Message('Reminder: Task Due Soon', recipients=[user_email])
        msg.body = f'Hi there!\n\nThis is a reminder that your task "{task_name}" is due soon.'
        mail.send(msg)

        print('Task reminder email sent successfully.')
    except Exception as e:
        print(f"An error occurred while sending task reminder email: {e}")

def send_start_task_email(user_id, task_id):
    try:
        # Retrieve user's email and task name from Firestore
        task_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id)
        task_data = task_ref.get().to_dict()
        user_email = db.collection('User').document(user_id).get().get('email')
        task_name = task_data.get('name')

        # Send email to user
        msg = Message('Reminder: Task Starts Soon', recipients=[user_email])
        msg.body = f'Hi there!\n\nThis is a reminder that your task "{task_name}" is starting soon.'
        mail.send(msg)

        print('Task reminder email sent successfully.')
    except Exception as e:
        print(f"An error occurred while sending task reminder email: {e}")

@app.route('/invite', methods=['POST'])
def invite_user():
    try:
        data = request.json
        email = data.get('email')
        task_id = data.get('taskId')
        inviter_id = data.get('inviterId')

        print(f"Received invite request for email: {email}, task_id: {task_id}, inviter_id: {inviter_id}")

        # Check if the user exists in the Firebase authentication
        try:
            user_record = TEMP_AUTH.get_user_by_email(email)
            user_id = user_record.uid
            print(f"User found with id: {user_id}")

            # Add user to the task
            task_ref = db.collection('Users').document(inviter_id).collection('Tasks').document(task_id)
            task = task_ref.get()
            if task.exists:
                task_data = task.to_dict()
                invited_users = task_data.get('InvitedUsers', [])
                if user_id not in invited_users:
                    invited_users.append(user_id)
                    task_ref.update({'InvitedUsers': invited_users})

                    # Add task path to SharedTaskTrees array of the invited user
                    task_path = f'Users/{inviter_id}/Tasks/{task_id}'
                    user_ref = db.collection('Users').document(user_id)
                    user_doc = user_ref.get()
                    if user_doc.exists:
                        user_data = user_doc.to_dict()
                        shared_task_trees = user_data.get('SharedTaskTrees', [])
                        if task_path not in shared_task_trees:
                            shared_task_trees.append(task_path)
                            user_ref.update({'SharedTaskTrees': shared_task_trees})
                return jsonify({'message': 'User invited to the task'}), 200
            else:
                return jsonify({'error': 'Task not found'}), 404
        except firebase_admin.auth.UserNotFoundError:
            print(f"User with email {email} does not exist in Firebase authentication")
            # Send invitation email to unregistered user
            try:
                msg = Message('Invitation to Join Life Happens', recipients=[email])
                msg.body = f'You have been invited to join Life Happens. Please sign up to collaborate on tasks: [Signup URL]'
                mail.send(msg)
                return jsonify({'message': 'Invitation sent to unregistered user'}), 200
            except Exception as e:
                print(f"Error sending email: {e}")
                return jsonify({'error': 'Failed to send invitation email'}), 500
    except Exception as e:
        print(f"Error in inviting user: {e}")
        return jsonify({'error': str(e)}), 500


# Run Flask app
if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
