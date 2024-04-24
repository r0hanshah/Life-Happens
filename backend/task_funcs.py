from firebase_admin import firestore
import json

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


