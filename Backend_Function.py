import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth

import pyrebase
from firebase_admin.auth import get_user

# Initialize Firebase app
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

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
class User:
    def __init__(self, ID, Name, WeeklyAITimesAllowed, ProfilePicture="", TaskTreeRoots=[], Settings={}, AllowAIMoveTasks=False, SharedTaskTrees=[], ParentsOfLeafNodesByTask={}):
        self.ID = ID
        self.Name = Name
        self.ProfilePicture = ProfilePicture
        self.TaskTreeRoots = TaskTreeRoots
        self.WeeklyAITimesAllowed = WeeklyAITimesAllowed
        self.Settings = Settings
        self.AllowAIMoveTasks = AllowAIMoveTasks
        self.SharedTaskTrees = SharedTaskTrees
        self.ParentsOfLeafNodesByTask = ParentsOfLeafNodesByTask

class Task:
    def __init__(self, ID, CreatorID, Title, StartDate, EndDate, DueDate, ExpectedTimeOfCompletion, Users=[], InvitedUsers=[], Ancestors=[], Children=[], IsMovable=True, Content={}, Notes="", ExtraMedia=[], isRoot=False, ContextText="", ContextFiles=[]):
        self.ID = ID
        self.CreatorID = CreatorID
        self.Users = Users
        self.InvitedUsers = InvitedUsers
        self.Title = Title
        self.Ancestors = Ancestors
        self.Children = Children
        self.StartDate = StartDate
        self.EndDate = EndDate
        self.DueDate = DueDate
        self.ExpectedTimeOfCompletion = ExpectedTimeOfCompletion
        self.IsMovable = IsMovable
        self.Content = Content
        self.Notes = Notes
        self.ExtraMedia = ExtraMedia
        self.isRoot = isRoot
        self.ContextText = ContextText
        self.ContextFiles = ContextFiles


class Subtask:
    def __init__(self, ID, CreatorID, Title, StartDate, EndDate, DueDate, ExpectedTimeOfCompletion, Users=[], InvitedUsers=[], Ancestors=[], Children=[], IsMovable=True, Content={}, Notes="", ExtraMedia=[], isRoot=False, ContextText="", ContextFiles=[]):
        self.ID = ID
        self.CreatorID = CreatorID
        self.Users = Users
        self.InvitedUsers = InvitedUsers
        self.Title = Title
        self.Ancestors = Ancestors
        self.Children = Children
        self.StartDate = StartDate
        self.EndDate = EndDate
        self.DueDate = DueDate
        self.ExpectedTimeOfCompletion = ExpectedTimeOfCompletion
        self.IsMovable = IsMovable
        self.Content = Content
        self.Notes = Notes
        self.ExtraMedia = ExtraMedia
        self.isRoot = isRoot
        self.ContextText = ContextText
        self.ContextFiles = ContextFiles
def login():
    firebase = pyrebase.initialize_app(firebaseConfig)
    auth = firebase.auth()

    print("Login in...")
    email = input("Enter email: ")
    password = input("Enter password: ")
    try:
        login = auth.sign_in_with_email_and_password(email, password)
        print("Successfully logged in")
        print(auth.get_account_info(login['idToken']))
        return login['localId']  # Return the user ID
    except:
        print("Invalid email or password.")
        return None  # Return None if login fails

def create_user(email, password):
    firebase = pyrebase.initialize_app(firebaseConfig)
    auth = firebase.auth()
    try:
        user = auth.create_user_with_email_and_password(email, password)
        user_id = user['localId']  # Retrieve the UID
        return user_id
    except Exception as e:
        print("Error creating user:", e)
        return None


def delete_user(user_id):
    try:
        # Delete the user's document
        db.collection('User').document(user_id).delete()
        auth.delete_user(user_id)
        print("User deleted successfully!")
        return True
    except Exception as e:
        print("Error deleting user:", e)
        return False

def delete_task(user_id, task_id):
    try:
        # Fetch all subtasks of the task
        subtasks_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id).collection('Subtasks').get()

        # Delete each subtask
        for subtask in subtasks_ref:
            subtask.reference.delete()

        # Delete the task document
        db.collection('User').document(user_id).collection('Tasks').document(task_id).delete()

        print("Task deleted successfully!")
        return True
    except Exception as e:
        print("Error deleting task:", e)
        return False


def delete_subtask(user_id, task_id, subtask_id):
    try:
        # Delete the subtask document
        db.collection('User').document(user_id).collection('Tasks').document(task_id).collection('Subtasks').document(subtask_id).delete()
        print("Subtask deleted successfully!")
        return True
    except Exception as e:
        print("Error deleting subtask:", e)
        return False

def update_user(user_id):
    print("Update user fields...")
    # Example: update the name field
    new_name = input("Enter new Name: ")
    try:
        db.collection('User').document(user_id).update({"Name": new_name})
        print("User fields updated successfully!")
    except Exception as e:
        print("Error updating user fields:", e)

def update_task(user_id):
    print("Update task fields...")
    # Example: update the title field of a task
    task_id = input("Enter Task ID: ")
    new_title = input("Enter new Title: ")
    try:
        db.collection('User').document(user_id).collection('Tasks').document(task_id).update({"Title": new_title})
        print("Task fields updated successfully!")
    except Exception as e:
        print("Error updating task fields:", e)

def update_subtask(user_id):
    print("Update subtask fields...")
    # Example: update the title field of a subtask
    task_id = input("Enter Task ID: ")
    subtask_id = input("Enter Subtask ID: ")
    new_title = input("Enter new Title: ")
    try:
        db.collection('User').document(user_id).collection('Tasks').document(task_id).collection('Subtasks').document(subtask_id).update({"Title": new_title})
        print("Subtask fields updated successfully!")
    except Exception as e:
        print("Error updating subtask fields:", e)

def getUser(user_id):
    try:
        # Fetch user document from Firestore
        user_doc = db.collection('User').document(user_id).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            # Fetch user email from Firebase Authentication
            user = auth.get_user(user_id)
            user_data['email'] = user.email if user else None
            print(user_data)
            return user_data
        else:
            print("User not found.")
            return None
    except Exception as e:
        print("Error fetching user:", e)
        return None


def getTasks(user_id):
    try:
        # Fetch tasks collection for the user
        tasks_ref = db.collection('User').document(user_id).collection('Tasks').get()
        tasks_list = []
        for task_doc in tasks_ref:
            tasks_list.append(task_doc.to_dict())
        return tasks_list
    except Exception as e:
        print("Error fetching tasks:", e)
        return None


def sign_up():
    print("Sign up...")
    name = input("Enter Name: ")
    email = input("Enter Email: ")
    password = input("Enter Password: ")

    # Check if the email already exists in the Firestore database
    existing_users = db.collection('User').where('Email', '==', email).get()
    if existing_users:
        print("Email already exists!")
        return None

    user_id = create_user(email, password)

    if user_id:
        try:
            weekly_ai_times = input("Enter your weekly AI times allowed (format: 'Monday:StartTime:::EndTime, Tuesday:StartTime:::EndTime, ...'): ")
            weekly_ai_times_dict = dict(item.split(":::") for item in weekly_ai_times.split(","))
            user_data = {
                "ID": user_id,
                "ProfilePicture": "https://example.com/profile.jpg",
                "TaskTreeRoots": ["root1", "root2"],
                "Name": name,
                "WeeklyAITimesAllowed":  weekly_ai_times_dict ,
                "Settings": {
                    "setting1": "value1",
                    "setting2": "value2"
                },
                "AllowAIMoveTasks": True,
                "SharedTaskTrees": ["sharedRoot1:::sharedNode1", "sharedRoot2:::sharedNode2"],
                "ParentsOfLeafNodesByTask": {
                    "root1": ["2024-02-22:::leafNode1", "2024-02-23:::leafNode2"],
                    "root2": ["2024-02-24:::leafNode3"]
                }
            }
            user_data= User(**user_data)
            user_ref = db.collection('User').document(user_id).set(user_data.__dict__)
            print("Successfully created account!")
            print("Your user ID is:", user_id)
            return user_id  # Return the user ID after successful sign up
        except Exception as e:
            print("Error:", e)
            return None


def create_task(user_id):
    print("Create a task...")
    title = input("Enter Title: ")
    start_date = input("Enter Start Date (YYYY-MM-DD): ")
    end_date = input("Enter End Date (YYYY-MM-DD): ")
    due_date = input("Enter Due Date (YYYY-MM-DD): ")
    expected_time = int(input("Enter Expected Time of Completion (in hours): "))
    try:
        task_data = {
            "ID": user_id,
            "CreatorID": user_id,
            "Users": ["user1", "user2"],
            "InvitedUsers": ["email1@example.com", "username2"],
            "Title": title,
            "Ancestors": ["ancestor1", "ancestor2"],
            "Children": ["child1", "child2"],
            "StartDate": start_date,
            "EndDate": end_date,
            "DueDate": due_date,
            "ExpectedTimeOfCompletion": expected_time,
            "IsMovable": True,
            "Content": {"field1": "value1", "field2": "value2"},
            "Notes": "Example notes with links: www.example.com",
            "ExtraMedia": ["https://example.com/image.jpg", "https://example.com/video.mp4"],
            "isRoot": False,
            "ContextText": "Example context",
            "ContextFiles": ["https://example.com/file1.pdf", "https://example.com/file2.docx"]
        }
        task_data = Task(**task_data)
        task_ref = db.collection('User').document(user_id).collection('Tasks').add(task_data.__dict__)
        task_id = task_ref[1].id

        print("Task created successfully!")
        print("Task ID:", task_id)
        return task_id
    except Exception as e:
        print("Error creating task:", e)


def create_subtask(user_id, task_id):
    print("Create a subtask...")
    title = input("Enter Title: ")
    start_date = input("Enter Start Date (YYYY-MM-DD): ")
    end_date = input("Enter End Date (YYYY-MM-DD): ")
    due_date = input("Enter Due Date (YYYY-MM-DD): ")
    expected_time = int(input("Enter Expected Time of Completion (in hours): "))

    subtask_data = {
        "CreatorID": user_id,
        "Title": title,
        "StartDate": start_date,
        "EndDate": end_date,
        "DueDate": due_date,
        "ExpectedTimeOfCompletion": expected_time,
        "IsMovable": True,
        "Content": {"field1": "value1", "field2": "value2"},
        "Notes": "Example notes with links: www.example.com",
        "ExtraMedia": ["https://example.com/image.jpg", "https://example.com/video.mp4"],
        "isRoot": False,
        "ContextText": "Example context",
        "ContextFiles": ["https://example.com/file1.pdf", "https://example.com/file2.docx"]
    }

    try:
        subtask_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id).collection(
            'Subtasks').add(subtask_data)
        subtask_id = subtask_ref.id
        print("Subtask created successfully!")
        print("Subtask ID:", subtask_id)
    except Exception as e:
        print("Error creating subtask:", e)


def invite_user_to_task(user_id, task_id, invited_users): # puts invited user email to task field,
    try:
        task_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id)
        for invitee in invited_users:
            if "@" in invitee:
                user = auth.get_user_by_email(invitee)
                invitee_id = user.uid
            else:
                invitee_id = invitee
            task_ref.update({"InvitedUsers": firestore.ArrayUnion([invitee_id])})
        print("Users invited to the task successfully!")
        return True
    except Exception as e:
        print("Error inviting users to task:", e)
        return False

def invite_user_to_subtask(user_id, task_id, subtask_id, invited_users): # puts invited user email to subtask field,
    try:
        subtask_ref = db.collection('User').document(user_id).collection('Tasks').document(task_id).colletion('Subtasks').document(subtask_id)
        for invitee in invited_users:
            if "@" in invitee:
                user = auth.get_user_by_email(invitee)
                invitee_id = user.uid
            else:
                invitee_id = invitee
            subtask_ref.update({"InvitedUsers": firestore.ArrayUnion([invitee_id])})
        print("Users invited to the subtask successfully!")
        return True
    except Exception as e:
        print("Error inviting users to task:", e)
        return False
