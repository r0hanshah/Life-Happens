from celery_app import celery

from boto3 import client
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

ses_client = client('ses', region_name='us-east-1')
sender = "lifehappensnotifications@gmail.com"

@celery.task(bind=True)
def send_email_task(recipient, subject, body_text, body_html, doc_ref):
    """
    Send an email using Amazon SES.

    Parameters:
        recipient: Email address of the recipient (must be verified in sandbox mode).
        subject: Subject of the email.
        body_text: Plain text version of the email body.
        body_html: HTML version of the email body.
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

        # Deleting notification document after successful delivery
        doc_ref.delete()

    except NoCredentialsError:
        print("AWS credentials not found.")
        doc_ref.update({"status":"incomplete=>AWS credentials not found."})
    except PartialCredentialsError:
        print("Incomplete AWS credentials configuration.")
        doc_ref.update({"status":"incomplete=>AWS credentials not found."})
    except Exception as e:
        print("Error sending email:", e)
        doc_ref.update({"status":f"incomplete=>{e}"})
