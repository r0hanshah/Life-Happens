from datetime import datetime, timedelta
from mail_tasks import send_email_task
from flask import Flask, request, jsonify, render_template, make_response, session
from flask_cors import CORS
from celery_app import celery

from flask_mail import Mail, Message

# Firebase related imports
from firebase_admin import credentials, initialize_app
from firebase_admin import firestore

# Mail delivery related imports
import boto3

# Configure celery app
# from utils import celery_init_app

# Initialize firestore
CRED = credentials.Certificate('./serviceAccountKey.json')
initialize_app(CRED, {
    'storageBucket': 'lifehappens-293da.appspot.com'
})
db = firestore.client()

app = Flask(__name__)

# # Set up celery
# app.config["CELERY_CONFIG"] = {
#     "broker_url":"redis://localhost:6379/0",
#     "result_backend":"redis://localhost:6379/0"
#     }
# celery = celery_init_app(app)
# celery.set_default()

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.route('/api/resource', methods=['GET', 'POST', 'OPTIONS'])
def build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    return response

# NOTE: Example email request
"""
{
    notification_id : <user_id>:::<task_id>:::<email_type>
    time_to_send : "2022-09-27 18:00:00.000",
    subject : "Time to get started on Task Name",
    recipient : "student27parra@gmail.com,
    body_text : "It is time to get started!\nTask Name\ndue date: 1/1/2025 3:00PM\nduration: 1 Hour\nnotes:\nSome notes..."
    type : "start_task"
    email_data : 
    {
        task_name : "Task Name"
        due_date : "1/1/2025 3:00 PM"
        duration : "1 Hour"
        notes : "A bunch of notes here"
    }
}
"""
@app.route('/schedule_email_notification', methods=['POST'])
def schedule_email_notification():
    # Get the json body
    data = request.json
    # From json body store:
    notification_id = data.get('notification_id')
    time_to_send = data.get('time_to_send') #ISO representation
    subject = data.get('subject')
    recipient = data.get('recipient')
    body_text = data.get('body_text')
    
    email_type = data.get('type')
    email_data = data.get('email_data')

    # Form HTML body from email data
    body_html = ""
    if email_type == "start_task" or email_type == "end_task":
        TASK_NAME = email_data['task_name']
        DUE_DATE = email_data['due_date']
        DURATION = email_data['duration']
        NOTES = email_data['notes']
        with open(f"./templates/{"get_started_email" if email_type == "start_task" else "finished_email"}.html", "r", encoding="utf-8") as file:
            html_content = file.read()
        body_html = html_content.format(TASK_NAME = TASK_NAME, DUE_DATE = DUE_DATE, DURATION = DURATION, NOTES = NOTES)
    
    # Store email item in firebase in the collection 'EmailNotifications' in a document with id as notification_id
    new_notification_ref = db.collection("EmailNotifications").document(notification_id)
    notidication_data = {
        "time_to_send" : time_to_send,
        "subject" : subject,
        "recipient" : recipient,
        "body_text" : body_text,
        "type" : email_type,
        "email_data" : email_data,
        "status" : "pending"
    }
    new_notification_ref.set(notidication_data)

    # Schedule email to be sent
    # Pass in the reference to the firebase document so it can be deleted once the notification is sent
    # try:
    send_email_task.apply_async(
        args=(recipient, subject, body_text, body_html), 
        task_id = notification_id,
        eta=datetime.fromisoformat(time_to_send)
        )
    return jsonify({'message': 'Email scheduled successfully!'}), 201
    # except Exception as e:
    #     print(f"An error occurred: {e}")
    #     return jsonify({'error': str(e)}), 500


@app.route('/reschedule_email_notification', methods=['PUT'])
def reschedule_email_notification():
    # Get the json body
    data = request.json
    # From json body store:
    new_time_to_send = data.get('time_to_send') #ISO representation
    subject = data.get('subject')
    recipient = data.get('recipient')
    body_text = data.get('body_text')
    notification_id = data.get('notification_id')
    
    email_type = data.get('type')
    email_data = data.get('email_data')

    # Delete the scheduled task
    celery.control.revoke(notification_id, terminate=True)

    # Form HTML body from email data
    body_html = ""
    if email_type == "start_task" or email_type == "end_task":
        TASK_NAME = email_data['task_name']
        DUE_DATE = email_data['due_date']
        DURATION = email_data['duration']
        NOTES = email_data['notes']
        with open(f"./templates/{"get_started_email" if email_type == "start_task" else "finished_email"}.html", "r", encoding="utf-8") as file:
            html_content = file.read()
        body_html = html_content.format(TASK_NAME = TASK_NAME, DUE_DATE = DUE_DATE, DURATION = DURATION, NOTES = NOTES)

    # Go to the document in firebase and update the scheduled times
    notification_ref = db.collection("EmailNotifications").document(notification_id)
    notif_doc = notification_ref.get()
    if not notif_doc:
        # This could mean that a notification for this task has already been sent so schedule a new one
        new_notification_ref = db.collection("EmailNotifications").document(notification_id)
        notidication_data = {
            "time_to_send" : new_time_to_send,
            "subject" : subject,
            "recipient" : recipient,
            "body_text" : body_text,
            "type" : email_type,
            "email_data" : email_data,
            "status" : "pending"
        }
        new_notification_ref.set(notidication_data)
    else:
        # Update document
        notification_ref.update({"time_to_send": new_time_to_send})
    
    # Schedule new email to be sent
    send_email_task.apply_async((recipient, subject, body_text, body_html, new_notification_ref), eta=datetime.fromisoformat(new_time_to_send), task_id=notification_id)

@app.route('/remove_email_notification', methods=['DELETE'])
def remove_email_notification():
    # Get the json body
    data = request.json
    # From the json body:
    notification_id = data.get("notification_id")

    # Delete the scheduled task
    celery.control.revoke(notification_id, terminate=True)

    # Delete the document in firebase
    db.collection("EmailNotifications").document(notification_id).delete()

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False, port=4000)