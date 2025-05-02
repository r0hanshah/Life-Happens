import boto3
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

def sendgrid_send_email_task(recipient, subject, body_text, body_html, sendgrid_api_key):
    message = Mail(
        from_email="lifehappensnotifications@gmail.com",
        to_emails=recipient,
        subject=subject,
        html_content=body_html,
        plain_text_content=body_text
    )
    try:
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)

def aws_send_email_task(recipient, subject, body_text, body_html, aws_access_key, aws_secret_key):
    """
    Send an email using Amazon SES.

    Parameters:
        recipient: Email address of the recipient (must be verified in sandbox mode).
        subject: Subject of the email.
        body_text: Plain text version of the email body.
        body_html: HTML version of the email body.
    """
    try:
        sender = "lifehappensnotifications@gmail.com"

        ses_client = boto3.client(
            'ses', 
            region_name='us-east-2',
            aws_access_key_id = aws_access_key,
            aws_secret_access_key = aws_secret_key
        )
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
        print(f"AWS Response: {response}")
        print(f"Email sent successfully from {sender} to {recipient}! Message ID:", response['MessageId'])

        # Deleting notification document after successful delivery
        # doc_ref.delete()

        return "Successfully sent email!"

    except NoCredentialsError:
        print("AWS credentials not found.")
        # doc_ref.update({"status":"incomplete=>AWS credentials not found."})
        return "AWS error"
    except PartialCredentialsError:
        print("Incomplete AWS credentials configuration.")
        # doc_ref.update({"status":"incomplete=>AWS credentials not found."})
        return "Incomplete Error"
    except Exception as e:
        print("Error sending email:", e)
        # doc_ref.update({"status":f"incomplete=>{e}"})
        return "Unkown Error"
