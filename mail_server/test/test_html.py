import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

from dotenv import load_dotenv
import os

load_dotenv()

AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')

ses_client = boto3.client(
    'ses', 
    region_name='us-east-2',
    aws_access_key_id = AWS_ACCESS_KEY,
    aws_secret_access_key = AWS_SECRET_KEY
    )

SENDER = "lifehappensnotifications@gmail.com"
RECIPIENT = "student27parra@gmail.com"
SUBJECT = "Get Started on Task Name"
BODY_TEXT = "Fall back"

def send_html_email():
    print(AWS_SECRET_KEY, AWS_ACCESS_KEY)

    with open("../templates/get_started_email.html", "r", encoding="utf-8") as file:
        html_content = file.read()

    try:
        # Send the email
        response = ses_client.send_email(
            Source=SENDER,
            Destination={
                'ToAddresses': [RECIPIENT],
            },
            Message={
                'Subject': {'Data': SUBJECT},
                'Body': {
                    'Text': {'Data': BODY_TEXT},
                    'Html': {'Data': html_content},
                },
            },
        )
        print(response)
        print("Email sent successfully! Message ID:", response['MessageId'])

    except NoCredentialsError:
        print("AWS credentials not found.")
    except PartialCredentialsError:
        print("Incomplete AWS credentials configuration.")
    except Exception as e:
        print("Error sending email:", e)
    
if __name__ == "__main__":
    send_html_email()