from mail_tasks import send_email_task
import os
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_KEY')

send_email_task("student27parra@gmail.com", "Test Email", "Hello", "<b>Hello</b>", AWS_ACCESS_KEY, AWS_SECRET_KEY)
