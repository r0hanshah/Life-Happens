import firebase_admin
from flask import Flask, request, jsonify, render_template
from flask_mail import Mail, Message
from firebase_auth import auth
from flask_cors import CORS
from firebase_admin import credentials
from firebase_admin import firestore








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
        
        print(user)

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
    data = request.json
    email = data.get('email')
    password = data.get('password')
    try:
        user = auth.sign_in_with_email_and_password(email, password)
        print(user)
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
    task_data['due_date'] = datetime.strptime(task_data['due_date'], '%Y-%m-%d').date() #not sure if this line works to get the due date
    task_data['start_date'] = datetime.strptime(task_data['start_date'], '%Y-%m-%d').date()
    task_ref.set(task_data)

    schedule_due_task_reminder(user_id, task_ref.id, task_data['due_date'], task_data['start_date']) #calling the email notification scheduler for task

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


@app.route('/user/<user_id>/task/<task_id>', methods=['DELETE'])
def delete_task(user_id, task_id):
    try:
        task_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id)
        task_ref.delete()
        return jsonify({'message': 'Task deleted successfully'}), 200
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': str(e)}), 500

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

    return AIFunctions().generate_tasks(context, start_date_iso_string, end_date_iso_string, pre_existing_subtasks, file_paths)



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
        scheduler.add_job(send_due_task_email, 'date', run_date=reminder_date, args=[user_id, task_id])
        scheduler.start()

        print('Task reminder scheduled successfully.')
    except Exception as e:
        print(f"An error occurred while scheduling task reminder: {e}")

#this function is called automatically by the scheduler
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
