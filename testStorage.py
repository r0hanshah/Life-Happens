import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
import pyrebase
# Initialize Firebase app with appropriate credentials and configuration
cred = credentials.Certificate("serviceAccountKey.json")
firebaseConfig={
  'apiKey': "AIzaSyBgDOWWLjlJXgWRtN_hkBk4InUCr6QqHng",
  'authDomain': "lifehappens-293da.firebaseapp.com",
  'projectId': "lifehappens-293da",
  'storageBucket': "lifehappens-293da.appspot.com",
  'messagingSenderId': "482058299460",
  'appId': "1:482058299460:web:92eff3955d7cf348c33411",
  'measurementId': "G-XDMYBRH5SV",
  'databaseURL': "https://lifehappens-293da-default-rtdb.firebaseio.com/"
}

firebase = pyrebase.initialize_app(firebaseConfig)

# Get a reference to Firebase Storage
storage = firebase.storage()


def folder_exists(folder_path):
  try:
    storage.child(folder_path).download("", metadata=True)
    return True
  except Exception as e:
    return False

def create_user_folder(user_id):
    # Define the parent folder path ("Users")
    parent_folder_path = "Users"

    # Combine the parent folder path and the user ID to get the full path
    user_folder_path = f"{parent_folder_path}/{user_id}"

    # Check if the user folder already exists
    if not folder_exists(user_folder_path):
      # Create the user folder
      storage.child(user_folder_path).put(None)
      print("User folder created successfully.")
    else:
      print("User folder already exists.")


def create_task_folder(user_id, task_id):
  # Define the parent folder path ("Users/UserID")
  parent_folder_path = f"Users/{user_id}"

  # Combine the parent folder path and the task ID to get the full path
  task_folder_path = f"{parent_folder_path}/{task_id}"

  # Check if the task folder already exists
  if not folder_exists(task_folder_path):
    # Create the task folder
    storage.child(task_folder_path).put(None)
    print("Task folder created successfully.")
  else:
    print("Task folder already exists.")


def create_subtask_folder(user_id, task_id, subtask_id):
  # Define the parent folder path ("Users/UserID/TaskID")
  parent_folder_path = f"Users/{user_id}/{task_id}"

  # Combine the parent folder path and the subtask ID to get the full path
  subtask_folder_path = f"{parent_folder_path}/{subtask_id}"

  # Check if the subtask folder already exists
  if not folder_exists(subtask_folder_path):
    # Create the subtask folder
    storage.child(subtask_folder_path).put(None)
    print("Subtask folder created successfully.")
  else:
    print("Subtask folder already exists.")


user_id = "jane3"
task_id = 123
subtask_id =321

# Test create_user_folder function
create_user_folder(user_id)

# Test create_task_folder function
create_task_folder(user_id, task_id)

# Test create_subtask_folder function
create_subtask_folder(user_id, task_id, subtask_id)

print("Folder creation completed.")
