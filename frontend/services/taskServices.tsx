// taskServices.tsx

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
  TaskTreeRoots: any[]; // Define a more specific type if possible
  WeeklyAITimesAllowed: number;
};


type TaskData = {
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
};

const BASE_URL = 'http://127.0.0.1:5000'; // Make sure to use the correct URL for your backend.

export const getTask = async (userId: string, taskId:string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/task/${taskId}`);
    const task = await response.json();
    if (response.ok) {
        console.log('Task:', task);
      return task;
    } else {
      throw new Error(task.error || 'An error occurred while fetching the task');
    }
  } catch (error) {
    console.error('Failed to fetch task:', error);
    throw error;
  }
};


// taskServices.tsx

export const addTask = async (userId: string, taskData: TaskData) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    const result = await response.json();
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

export const deleteTask = async (userId:string, taskId:string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/task/${taskId}`, {
      method: 'DELETE',
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

export const updateTask = async (userId:string, taskId:string, taskData: TaskData) => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/task/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
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
