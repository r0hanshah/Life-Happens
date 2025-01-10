from firebase_admin import firestore
from firebase_admin import storage
import json

import tempfile
import base64
import os
from file_extract_tools import read_file
from datetime import datetime, timedelta, timezone


# Firestore functions 
def add_task_to_firestore(user_id, task_data, taskPathArray, db):
    try:
        # Generate a new document reference with a unique ID if not provided
        task_ref = db.collection('Users').document(user_id).collection('Tasks').document()
        task_id = task_ref.id
        
        task_data['ID'] = task_id
        task_data['ExtraMedia'] = {'ID': task_id}  # Set ExtraMedia ID to task ID
        
        # Convert ISO formatted date strings to datetime objects
        task_data['EndDate'] = datetime.fromisoformat(task_data['EndDate'].replace('Z', '+00:00'))
        task_data['StartDate'] = datetime.fromisoformat(task_data['StartDate'].replace('Z', '+00:00'))
        
        parent_task_ref = db.collection('Users').document(user_id).collection('Tasks')

        # Create the path to the Task and update children references if needed
        for taskId in taskPathArray:
            parent_task_ref = parent_task_ref.document(taskId)
            parent_task_ref = parent_task_ref.collection('Tasks')

        # Add current task ID
        task_ref = parent_task_ref.document(task_id)
        task_ref.set(task_data)

        user_ref = db.collection('Users').document(user_id)
        
        if len(taskPathArray) == 0:
            user_ref.update({f"TaskTreeRoots.{task_id}": task_data.get('StartDate')})

        user_ref.update({f"Nodes.{task_id}":f"{task_data.get('StartDate')}:::{task_data.get('EndDate')}:::{'/'.join(taskPathArray)}"})

        return task_id
    except Exception as e:
        print(f"An error occurred while adding task to Firestore: {e}")
        raise

def edit_task_in_firestore(data, taskPathArray, db):
    try:
        if isinstance(data, str):
            data = json.loads(data)
        print("Data received for edit:", data)
        creatorID = data.get('CreatorID')
        ID = data.get('ID')

        # Navigate to the correct task document
        task_ref = db.collection('Users').document(creatorID).collection('Tasks').document(ID)
        
        # Check if the document exists
        task_doc = task_ref.get()
        if not task_doc.exists:
            print(f"Document with ID {ID} does not exist in path Users/{creatorID}/Tasks.")
            raise Exception(f"Document with ID {ID} does not exist.")

        # Update the task
        task_ref.update(data)

        # Update the user's TaskTreeRoots with the new StartDate
        user_ref = db.collection('Users').document(creatorID)
        user_ref.update({f"TaskTreeRoots.{ID}": data.get('StartDate')})

        print(f"Task {ID} updated successfully for user {creatorID}.")
    except Exception as e:
        print(f"Error editing document: {e}")
        raise



def get_task_in_firestore(task_Id, creatorId, taskPathArray, db):
    try:

        task_ref = db.collection('Users').document(creatorId).collection('Tasks')

        # Create the path to the Task
        for taskId in taskPathArray:
            task_ref = task_ref.document(taskId).collection('Tasks')

        # Add current task id
        task_ref = task_ref.document(task_Id)

        print(taskPathArray, task_Id)

        task = task_ref.get()

        if task.exists:
            return task.to_dict()
        else:
            return None

    except Exception as e:
        print(f"Error creating document: {e}")


def delete_task_in_firestore(data, taskPathArray, db):
    try:

        data = json.loads(data)
        creatorId = data.get('CreatorID')
        task_id = data.get('ID')
        is_root = data.get('IsRoot')

        task_ref = db.collection('Users').document(creatorId).collection('Tasks')

        # Create the path to the Task
        for taskId in taskPathArray:
            task_ref = task_ref.document(taskId).collection('Tasks')

        # Add current task id
        task_ref = task_ref.document(task_id)

        print(f"Attempting to delete task: {task_id}")
        task_ref.delete()
        print(f"Successfully deleted: {task_id}")

        user_ref = db.collection('Users').document(creatorId)
        print(f"Attempting to remove reference from lookup table: {task_id}")
        if is_root:
            user_ref.update({f"TaskTreeRoots.{task_id}": firestore.DELETE_FIELD})
        
        user_ref.update({f"Nodes.{task_id}": firestore.DELETE_FIELD})
        print(f"Successfully removed reference from lookup table: {task_id}")

    except Exception as e:
        print(f"Error deleting document: {e}")

# Firebase Storage functions


def upload_file_in_storage(file_content, filename, task_path_array, task_id, user_id, bucket):
    try:
        print("Uploading file to task")
        file_path = f'Users/{user_id}/'

        # Create the path to the Task
        for taskId in task_path_array:
            file_path += f'{taskId}/'

        file_path += f'{task_id}/{filename}'

        # Save the decoded file content to a temporary file
        # temp_file_path = f'./tmp/{user_id}_{filename}'

        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            temp_file.write(file_content)
            temp_file_path = temp_file.name

        # with open(temp_file_path, 'wb') as temp_file:
        #     temp_file.write(file_content)

        # Upload the file to Firebase Storage
        blob = bucket.blob(file_path)
        blob.upload_from_filename(temp_file_path)

        # Delete the temporary file
        os.remove(temp_file_path)

    except Exception as e:
        print(f"Error creating document: {e}")

def delete_file_in_storage(filename, task_path_array, task_id, user_id, bucket):
    try:
        print("Uploading file to task")
        file_path = f'Users/{user_id}/'

        # Create the path to the Task
        for taskId in task_path_array:
            file_path += f'{taskId}/'

        file_path += f'{task_id}/{filename}'

        # Delete the file to Firebase Storage
        blob = bucket.blob(file_path)
        blob.delete()

        # Delete the temporary file

    except Exception as e:
        print(f"Error creating document: {e}")

# def get_files_from_storage(bucket, file_path):
#     try:
#         # List all files in the storage bucket
#         blob = bucket.blob(file_path)

#         file_info = {
#             'name': blob.name,
#             'size': blob.size,
#             'type': blob.content_type,
#             'url': blob.generate_signed_url(expiration=3600)  # Generate a signed URL for downloading the file
#         }

#         return file_info
    
#     except Exception as e:
#         print(f"Error retrieving files from Firebase Storage: {str(e)}")
def get_files_from_storage(bucket, file_path):
    try:
        blob = bucket.blob(file_path)
        file_content = blob.download_as_bytes()  # Download file as bytes

        # Determine the file type from the file_path
        file_extension = os.path.splitext(file_path)[1].lower()
        
        # Save file content temporarily to read it based on type
        temp_file_path = '/tmp/tempfile' + file_extension

        with open(temp_file_path, 'wb') as temp_file:
            temp_file.write(file_content)

        # Read the file using the appropriate reader
        data = read_file(temp_file_path)
        return data
    except Exception as e:
        print(f"Error reading file from storage: {str(e)}")
        return {'error': str(e)}
