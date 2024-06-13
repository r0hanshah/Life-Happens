from firebase_admin import firestore
from firebase_admin import storage
import json

import tempfile
import base64
import os
from file_extract_tools import read_file


# Firestore functions 

def add_task_to_firestore(data, taskPathArray, db):
    try:
        print(data)
        data = json.loads(data)
        creatorID = data.get('CreatorID')
        ID = data.get('ID')

        tempCount = 0
        task_ref = db.collection('Users').document(creatorID).collection('Tasks')

        # Create the path to the Task
        for taskId in taskPathArray:
            task_ref = task_ref.document(taskId)

            tempCount += 1
            if(tempCount == len(taskPathArray)):
                task_ref.update({'Children': firestore.ArrayUnion([ID])})

            task_ref = task_ref.collection('Tasks')
            

        # Add current task id
        task_ref = task_ref.document(ID)

        task_ref.set(data)

        if (len(taskPathArray) == 0):
            user_ref = db.collection('Users').document(creatorID)

            user_ref.update({f"TaskTreeRoots.{ID}": data.get('StartDate')})

    except Exception as e:
        print(f"Error creating document: {e}")

def edit_task_in_firestore(data, taskPathArray, db):
    try:
        print(data)
        data = json.loads(data)
        creatorID = data.get('CreatorID')
        ID = data.get('ID')

        task_ref = db.collection('Users').document(creatorID).collection('Tasks')

        # Create the path to the Task
        for taskId in taskPathArray:
            task_ref = task_ref.document(taskId).collection('Tasks')

        # Add current task id
        task_ref = task_ref.document(ID)

        task_ref.update(data)

        user_ref = db.collection('Users').document(creatorID)

        user_ref.update({f"TaskTreeRoots.{ID}": data.get('StartDate')})

    except Exception as e:
        print(f"Error creating document: {e}")

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

        task_ref.delete()

        user_ref = db.collection('Users').document(creatorId)
        
        if is_root:
            user_ref.update({f"TaskTreeRoots.{task_id}": firestore.DELETE_FIELD})

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
