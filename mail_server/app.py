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

# Initialize firestore
CRED = credentials.Certificate('./serviceAccountKey.json')
initialize_app(CRED, {
    'storageBucket': 'lifehappens-293da.appspot.com'
})
db = firestore.client()

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.route('/schedule_email_notification', methods=['POST'])
def schedule_email_notification():
    # Get the json body
    data = request.json
    # From json body store:
    time_to_send = data.get('time_to_send') #ISO representation
    subject = data.get('subject')
    recipient = data.get('recipient')
    body_html = data.get('body_html')
    body_text = data.get('body_text')
    notification_id = data.get('notification_id')
    
    # Store email item in firebase in the collection 'EmailNotifications' in a document with id as notification_id
    new_notification_ref = db.collection("EmailNotifications").document(notification_id)
    notidication_data = {
        "time_to_send" : time_to_send,
        "subject" : subject,
        "recipient" : recipient,
        "body_html" : body_html,
        "body_text" : body_text,
        "status" : "pending"
    }
    new_notification_ref.set(notidication_data)

    # Schedule email to be sent
    # Pass in the reference to the firebase document so it can be deleted once the notification is sent
    send_email_task.apply_async((recipient, subject, body_text, body_html, new_notification_ref), eta=datetime.fromisoformat(time_to_send), task_id=notification_id)

@app.route('/reschedule_email_notification', methods=['PUT'])
def reschedule_email_notification():
    # Get the json body
    data = request.json
    # From json body store:
    new_time_to_send = data.get('time_to_send') #ISO representation
    subject = data.get('subject')
    recipient = data.get('recipient')
    body_html = data.get('body_html')
    body_text = data.get('body_text')
    notification_id = data.get('notification_id')

    # Delete the scheduled task
    celery.control.revoke(notification_id, terminate=True)

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
            "body_html" : body_html,
            "body_text" : body_text,
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