from mail_server.celery_app import celery

from boto3 import client
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

from datetime import datetime

ses_client = client('ses', region_name='us-east-1')
sender = "lifehappensnotifications@gmail.com"

@celery.task
def send_email(recipient, subject, body_text, body_html):
    """
    Send an email using Amazon SES.

    :param recipient: Email address of the recipient (must be verified in sandbox mode).
    :param subject: Subject of the email.
    :param body_text: Plain text version of the email body.
    :param body_html: HTML version of the email body.
    """
    try:
        # Send the email
        response = ses_client.send_email(
            Source=sender,
            Destination={
                'ToAddresses': [recipient],
            },
            Message={
                'Subject': {'Data': subject},
                'Body': {
                    'Text': {'Data': body_text},
                    'Html': {'Data': body_html},
                },
            },
        )
        print("Email sent successfully! Message ID:", response['MessageId'])

    except NoCredentialsError:
        print("AWS credentials not found.")
    except PartialCredentialsError:
        print("Incomplete AWS credentials configuration.")
    except Exception as e:
        print("Error sending email:", e)
