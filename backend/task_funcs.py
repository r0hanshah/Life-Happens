from firebase_admin import firestore
from firebase_admin import storage
import json


# Firestore functions 

def add_task_to_firestore(data, taskPathArray, db):
    try:
        print(data)
        data = json.loads(data)
        creatorID = data.get('CreatorID')
        ID = data.get('ID')

        task_ref = db.collection('User').document(creatorID).collection('Tasks')

        # Create the path to the Task
        for taskId in taskPathArray:
            task_ref = task_ref.document(taskId).collection('Tasks')

        # Add current task id
        task_ref = task_ref.document(ID)

        task_ref.set(data)

        user_ref = db.collection('User').document(creatorID)

        user_ref.update({f"TaskTreeRoots.{ID}": data.get('StartDate')})

    except Exception as e:
        print(f"Error creating document: {e}")

def edit_task_in_firestore(data, taskPathArray, db):
    try:
        print(data)
        data = json.loads(data)
        creatorID = data.get('CreatorID')
        ID = data.get('ID')

        task_ref = db.collection('User').document(creatorID).collection('Tasks')

        # Create the path to the Task
        for taskId in taskPathArray:
            task_ref = task_ref.document(taskId).collection('Tasks')

        # Add current task id
        task_ref = task_ref.document(ID)

        task_ref.update(data)

        user_ref = db.collection('User').document(creatorID)

        user_ref.update({f"TaskTreeRoots.{ID}": data.get('StartDate')})

    except Exception as e:
        print(f"Error creating document: {e}")


def delete_task_in_firestore(taskId, creatorId, taskPathArray, db):
    try:

        task_ref = db.collection('User').document(creatorId).collection('Tasks')

        # Create the path to the Task
        for taskId in taskPathArray:
            task_ref = task_ref.document(taskId).collection('Tasks')

        # Add current task id
        task_ref = task_ref.document(taskId)

        task_ref.delete()

        user_ref = db.collection('User').document(creatorId)

        user_ref.update({f"TaskTreeRoots.{taskId}": firestore.DELETE_FIELD})

    except Exception as e:
        print(f"Error creating document: {e}")

# Firebase Storage functions


# def upload_file_in_storage(task_path_array, file_path, bucket):
#     try:

#         task_ref = db.collection('User').document(creatorId).collection('Tasks')

#         # Create the path to the Task
#         for taskId in taskPathArray:
#             task_ref = task_ref.document(taskId).collection('Tasks')

#         # Add current task id
#         task_ref = task_ref.document(taskId)

#         task_ref.delete()

#         user_ref = db.collection('User').document(creatorId)

#         user_ref.update({f"TaskTreeRoots.{taskId}": firestore.DELETE_FIELD})

#     except Exception as e:
#         print(f"Error creating document: {e}")