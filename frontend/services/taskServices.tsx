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
