// taskServices.tsx

// No need to import fetch as it's a global function available in React Native

const BASE_URL = 'http://127.0.0.1:5000'; // Make sure to use the correct URL for your backend.

export const getTask = async (userId, taskId) => {
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

export const addTask = async (userId, taskData) => {
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

export const deleteTask = async (userId, taskId) => {
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

export const updateTask = async (userId, taskId, taskData) => {
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

export const getUser = async (userId) => {
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
