from datetime import datetime, timedelta
from mail_tasks import send_scheduled_email
from flask import Flask, request, jsonify, render_template, make_response, session
from flask_cors import CORS
from celery_app import celery

from flask_mail import Mail, Message

# Firebase related imports
import firebase_admin

# Mail delivery related imports
import boto3


app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

@app.route('/schedule_email_notification')
def schedule_email_notification():
    # Get the json body
    # From json body store:
    #  time_to_send
    #  subject
    #  recipient
    #  body_html
    #  body_text
    #  notification_id
    
    # Schedule email to be sent

    # Store email item in firebase in the collection Scheduled Email Notifications in a document with id as notification_id

    pass

@app.route('/reschedule_email_notification')
def reschedule_email_notification():
    # Get the json body
    # From json body store:
    #  notification_id
    #  new_time

    # Delete the scheduled task

    # Schedule a new task

    # Go to the document in firebase and update the scheduled times

    pass

@app.route('/remove_email_notification')
def remove_email_notification():
    # Get the json body
    # From the json body:
    #  notification_id

    # Delete the scheduled task

    # Delete the document in firebase
    
    pass

# DOCUMENTATION
# Schedule email for 10 minutes from now
recipient = "user@example.com"
subject = "Task Reminder"
body = "Don't forget to start your task!"
delay = (datetime.now() + timedelta(minutes=10)).timestamp()

# Schedule the email task
send_scheduled_email.apply_async(args=[recipient, subject, body], eta=delay)