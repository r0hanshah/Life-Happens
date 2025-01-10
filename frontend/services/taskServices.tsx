// taskServices.tsx
import { DocumentPickerAsset } from "expo-document-picker"
import TaskModel from "../models/TaskModel";
import UserModel from "../models/UserModel";


// No need to import fetch as it's a global function available in React Native

// types
type UserData = {
  AllowAIMoveTasks: boolean;
  ID: string;
  Name: string;
  ParentsOfLeafNodesByTask: any; // You may define a more specific type here if you know the structure
  ProfilePicture: string;
  Settings: any; // Define a more specific type based on the settings structure
  SharedTaskTrees: any[]; // Define a more specific type if possible
  TaskTreeNodes: any[]; // Define a more specific type if possible
  WeeklyAITimesAllowed: number;
};


export type TaskData = {
  Color:string,
  Ancestors: string[],
  Children: string[],
  Content: {},
  ContextFiles: string[],
  UnobservedFiles: string[],
  ContextText: string,
  CreatorID: string,
  EndDate: string,
  ExtraMedia: string[],
  ID: string,
  InvitedUsers: string[],
  IsMovable: boolean,
  Notes: string,
  StartDate: string,
  Title: string,
  Users: string[],
  IsRoot: boolean
  Completeness: number
};

const BASE_URL = 'http://127.0.0.1:5000'; // Make sure to use the correct URL for your backend.

export const getTask = async (userId: string, taskId:string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/task/${taskId}`);
    const task = await response.json();
    if (response.ok) {
      console.log('Task:', task);
      const ancestors = task['Ancestors'] as string[]
      const children = task['Children'] as string[]
      const color = task['Color'] as string
      const id = task['ID'] as string
      const creatorId = task['CreatorID'] as string
      const content = task['Content']
      const contextFiles = task['ContextFiles'] as string[]
      const contextText = task['ContextText'] as string
      const endDate = task['EndDate'] as string
      const extraMedia = task['ExtraMedia'] as string[]
      const invitedUsers = task['InvitedUsers'] as string[]
      const isMovable = task['IsMovable'] as boolean
      const isRoot = task['IsRoot'] as boolean
      const notes = task['Notes'] as string
      const startDate = task['StartDate'] as string
      const title = task['Title'] as string
      const unobservedFiles = task['UnobservedFiles'] as string[]
      const users = task['Users'] as string[]
      const completeness = task['Completeness'] as number
     
      const returnTask = new TaskModel(id, creatorId, isRoot ? id : ancestors[ancestors.length-1], [], invitedUsers, title, color, [], [], startDate, endDate, isMovable, content, notes, extraMedia, isRoot, contextText, [], [])
      returnTask.completeness = completeness

      loadFilesToUser(returnTask, "context", contextFiles, id, ancestors, creatorId).finally(()=>{
        loadFilesToUser(returnTask, "unobserved", unobservedFiles, id, ancestors, creatorId)
      })

      console.log(children)
      for(const child of children)
      {
        loadChildren(userId, child, [returnTask.id], returnTask)
      }
      


      return returnTask;
    } else {
      throw new Error(task.error || 'An error occurred while fetching the task');
    }
  } catch (error) {
    console.error('Failed to fetch task:', error);
    throw error;
  }
};

export const fetchTask = async (userId: string, taskId: string, ancestorArray: string[], parent: TaskModel | null): Promise<[TaskModel, string[], string[]]> => {
  console.log(taskId)
  console.log(ancestorArray)
  try {
    const response = await fetch(`${BASE_URL}/fetchTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'task_id': taskId,
        'user_id': userId,
        'task_path_array': ancestorArray
      }),
    });

    const task = await response.json();

    if (response.ok) {
      console.log('Fetched Task:', task);
      const ancestors = task['Ancestors'] as string[]
      const children = task['Children'] as string[]
      const color = task['Color'] as string
      const id = task['ID'] as string
      const creatorId = task['CreatorID'] as string
      const content = task['Content']
      const contextFiles = task['ContextFiles'] as string[]
      const contextText = task['ContextText'] as string
      const endDate = task['EndDate'] as string
      const extraMedia = task['ExtraMedia'] as string[]
      const invitedUsers = task['InvitedUsers'] as string[]
      const isMovable = task['IsMovable'] as boolean
      const isRoot = task['IsRoot'] as boolean
      const notes = task['Notes'] as string
      const startDate = task['StartDate'] as string
      const title = task['Title'] as string
      const unobservedFiles = task['UnobservedFiles'] as string[]
      const users = task['Users'] as string[]
      const completeness = task['Completeness'] as number

      const returnTask = new TaskModel(id, creatorId, isRoot ? id : ancestors[ancestors.length - 1], [], invitedUsers, title, color, [], [], startDate, endDate, isMovable, content, notes, extraMedia, isRoot, contextText, [], [])
      returnTask.completeness = completeness

      loadFilesToUser(returnTask, "context", contextFiles, id, ancestors, creatorId).finally(() => {
        loadFilesToUser(returnTask, "unobserved", unobservedFiles, id, ancestors, creatorId)
      })

      if (parent != null) {
        parent.children.push(returnTask)
        returnTask.ancestors = [parent, ...parent.ancestors]
      }

      return [returnTask, children, [returnTask.id, ...returnTask.ancestors.map(task => task.id)]];
    } else {
      throw new Error(task.error || 'An error occurred while fetching the task');
    }
  } catch (error) {
    console.error('Failed to fetch task:', error);

    // Fetch from shared paths if personal task fetch fails
    try {
      const userDoc = await firestore.collection('Users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const sharedTaskPaths = userData?.SharedTaskTrees || [];
        for (const path of sharedTaskPaths) {
          const pathComponents = path.split('/');
          const sharedUserId = pathComponents[1]; // Extract user ID from path
          const sharedTaskId = pathComponents[pathComponents.length - 1]; // Extract task ID from path
          const taskPathArray = pathComponents.slice(3, pathComponents.length - 1); // Extract task path array

          if (sharedTaskId === taskId) {
            return await fetchTask(sharedUserId, taskId, taskPathArray, parent);
          }
        }
      }
    } catch (sharedError) {
      console.error('Failed to fetch shared task:', sharedError);
    }

    throw error;
  }
};

export const loadChildren = (userId: string, taskId:string, ancestorArray:string[], parent:TaskModel | null) => {
  const tree = preOrderTraversal(userId, taskId, ancestorArray, parent, fetchTask)

  console.log('Tree: ',tree)

  return tree
}

type VisitCallback = (userId: string, taskId:string, ancestorArray:string[], parent:TaskModel | null) => Promise<[TaskModel, string[], string[]] | null>;

// Function to traverse a tree in pre-order
async function preOrderTraversal(userId: string, taskId:string, ancestorArray:string[], parent:TaskModel | null, visit: VisitCallback) {
  // Visit the root node
  console.log(taskId, ancestorArray)
  visit(userId, taskId, ancestorArray, parent).then(result => {
    if (result != null)
      {
        const root = result[0]
        const children = result[1]
        const ancestors = result[2]
      
        console.log("Parent passed?", ancestors)
        console.log("Children: ", children)
      
        // Recursively traverse each child node
        children.forEach(child => {
          preOrderTraversal(userId, child, ancestors, root, visit);
        });
      }
      else {
        console.log("Result was null while recursively loading tasks")
      }
    
  })

}

const loadFilesToUser = async (task:TaskModel, fileArrayType:string, fileNameArray:string[], taskId:string, taskAncestors:string[], userId:string) => {
  const documents:DocumentPickerAsset[] = []
  const promises: Promise<DocumentPickerAsset | null>[] = [];

  for(const file of fileNameArray)
    {
      promises.push(getFile(userId, taskAncestors, userId, file).catch(e => {
        console.error('Error fetching file:', e);
        return null; // Return null in case of an error
    }))
    }
    
    const resolvedFiles = await Promise.all(promises);

    resolvedFiles.forEach(file => {
      if (file !== null) {
          documents.push(file);
      }
  });

  if(fileArrayType == "context")
  {
    task.contextFiles = documents
  }
  else if(fileArrayType == "unobserved")
  {
    task.unobservedFiles = documents
  }
  else 
  {
    console.log("Invalid")  
  }
}


// taskServices.tsx

export const addTask = async (taskData: TaskData, taskPathArray: string[], userId: string) => {
  try {
    const payload = {
      user_id: userId,
      task: taskData,
      task_path_array: taskPathArray
    };

    console.log('Payload being sent:', JSON.stringify(payload));
    console.log('Task Path Array:', taskPathArray);  // Log the user_id to ensure it's not undefined or null

    const response = await fetch(`${BASE_URL}/addTask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log('Response received:', result);

    if (response.ok) {
      console.log('Task added:', result);
      return result;
    } else {
      throw new Error(result.error || 'An error occurred while adding the task');
    }
  } catch (error) {
    console.error('Failed to add task:', error);
    throw error;
  }
};




// taskServices.tsx

export const deleteTask = async (taskData: TaskData, taskPathArray:string[]) => {
  try {
    const response = await fetch(`${BASE_URL}/deleteTask`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'task': JSON.stringify(taskData),
        'task_path_array':taskPathArray
      }),
    });
    if (response.ok) {
      console.log('Task deleted');
      return true;
    } else {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred while deleting the task');
    }
  } catch (error) {
    console.error('Failed to delete task:', error);
    throw error;
  }
};


// taskServices.tsx

export const updateTask = async (taskData: TaskData, taskPathArray:string[]) => {
  try {
    const response = await fetch(`${BASE_URL}/editTask`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'task': JSON.stringify(taskData),
        'task_path_array':taskPathArray
      }),
    });
    if (response.ok) {
      console.log('Task updated');
      return true;
    } else {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred while updating the task');
    }
  } catch (error) { 
    console.error('Failed to update task:', error);
    throw error;
  }
};


// taskServices.tsx or userServices.tsx

export const getUser = async (userId:string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (response.ok) {
      const user = await response.json();
      console.log('User data:', user);
      return user;
    } else {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred while fetching the user data');
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
};

// taskServices.tsx or userServices.tsx

export const deleteUser = async (userId:string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      console.log('User deleted');
      return true;
    } else {
      const error = await response.json();
      throw new Error(error.error || 'An error occurred while deleting the user');
    }
  } catch (error) {
    console.error('Failed to delete user:', error);
    throw error;
  }
};

export const addUser = async (userData: UserData) => {
  try {
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const result = await response.json();
    if (response.ok) {
      // console.log('User added:', result);
      return result;
    } else {
      throw new Error(result.error || 'An error occurred while adding the user');
    }
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

// In your services file, add this function to handle user updates
export const updateUser = async (userId:string, userData:UserData) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      throw new Error('Problem updating user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Upload files

export const uploadFile = async (user_id:string, task_path_array:string[], task_id: string, file: {
  name: string;
  size: number | undefined;
  type: string;
  uri: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'file': file,
        'task_path_array': task_path_array,
        'task_id': task_id,
        'user_id': user_id
      }),
    });
    if (!response.ok) {
      throw new Error('Problem updating user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Upload files

export const deleteFile = async (user_id:string, task_path_array:string[], task_id: string, filename:string) => {
  try {
    const response = await fetch(`${BASE_URL}/deletefile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'filename':filename,
        'task_path_array': task_path_array,
        'task_id': task_id,
        'user_id': user_id
      }),
    });
    if (!response.ok) {
      throw new Error('Problem updating user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const getFile = async (taskId:string, taskAncestors:string[], userId:string, filename:string) => {
  const filePath = 'Users/'+userId+'/'+taskAncestors.join('/')+'/'+taskId+'/'+filename
  try {
    const response = await fetch(`${BASE_URL}/getfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'file_path':filePath
      }),
    });
    if (!response.ok) {
      throw new Error('Problem getting file');
    }
    const file = await response.json()

    const fileName = file.name.split('/').pop();

    const doc:DocumentPickerAsset = {
      uri: file.url, // Use the signed URL provided by the backend
      name: fileName,
      mimeType: file.type,
    }

    return doc
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
}
