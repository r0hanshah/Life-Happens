// ButtonTest.tsx
import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { getTask, addTask, deleteTask, updateTask, getUser, deleteUser, addUser, updateUser} from '../../services/taskServices'; // Adjust the import path as necessary


interface Task {
    name: string; // Adjust based on your task data structure
}

const ButtonTest = ({ userId, taskId }: { userId: string, taskId: string }) => {
    const [task, setTask] = useState<Task | null>(null); // Provide type for task
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);


    const handleGetTask = async () => {
        console.log('handleGetTask called');
        try {
            const fetchedTask = await getTask(userId, taskId);
            setTask(fetchedTask);

            setError('');
        } catch (e) {
            setError((e as Error).message);
            console.log('Error:', e);
        }
    };

    const handleAddTask = async () => {
        console.log('handleAddTask called');
        try {
            // Define the new task data structure as per your Firestore model
            const newTaskData = {
                "Ancestors": [
                    "XwpY...(Previous Task Id)"
                ],
                "Children": [
                    "Subtask Id",
                    "Rohan's Child"
                ],
                "Content": {
                    "field1": "value1",
                    "field2": "value2"
                },
                "ContextFiles": [
                    "https://example.com/file1.pdf",
                    "https://example.com/file2.docx"
                ],
                "ContextText": "Example context",
                "CreatorID": "3fh7J42CtTMuxmRrXflm7znrl5g1",
                "DueDate": "2024-02-12",
                "EndDate": "2024-02-10",
                "ExpectedTimeOfCompletion": 20,
                "ExtraMedia": [
                    "https://example.com/image.jpg",
                    "https://example.com/video.mp4"
                ],
                "ID": "3fh7J42CtTMuxmRrXflm7znrl5g1",
                "InvitedUsers": [
                    "email1@example.com",
                    "username2"
                ],
                "IsMovable": true,
                "Notes": "Example notes with links: www.example.com",
                "StartDate": "2024-02-01",
                "Title": "Essay",
                "Users": [
                    "user1",
                    "user2"
                ],
                "isRoot": false
            }
    
            const result = await addTask(userId, newTaskData);
            console.log('New task added with ID:', result.taskId);
            // Optionally, you can now fetch the new task to update the UI
        } catch (e) {
            console.error('Error adding task:', e);
        }
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask(userId, taskId);
            // Update state or inform the user of successful deletion
            console.log(`Task ${taskId} deleted successfully`);
        } catch (e) {
            console.error('Error deleting task:', e);
            // Handle the error, e.g., display an error message to the user
        }
    };
    const handleEditTask = async () => {
        try {
            const taskData = {
                // Include the fields that you want to update
                    "Ancestors": [
                        "XwpY...(Previous Task Id)"
                    ],
                    "Children": [
                        "Rohan's Child 1",
                        "Rohan's Child 2"
                    ],
                    "Content": {
                        "field1": "value1",
                        "field2": "value2"
                    },
                    "ContextFiles": [
                        "https://example.com/file1.pdf",
                        "https://example.com/file2.docx"
                    ],
                    "ContextText": "Example context",
                    "CreatorID": "3fh7J42CtTMuxmRrXflm7znrl5g1",
                    "DueDate": "2024-02-12",
                    "EndDate": "2024-02-10",
                    "ExpectedTimeOfCompletion": 20,
                    "ExtraMedia": [
                        "https://example.com/image.jpg",
                        "https://example.com/video.mp4"
                    ],
                    "ID": "3fh7J42CtTMuxmRrXflm7znrl5g1",
                    "InvitedUsers": [
                        "email1@example.com",
                        "username2"
                    ],
                    "IsMovable": true,
                    "Notes": "Example notes with links: www.example.com",
                    "StartDate": "2024-02-01",
                    "Title": "Essay",
                    "Users": [
                        "user1",
                        "user2"
                    ],
                    "isRoot": false
                }
            await updateTask(userId, taskId, taskData);
            // Handle the UI update or inform the user of a successful update
            console.log(`Task ${taskId} updated successfully`);
        } catch (e) {
            console.error('Error updating task:', e);
            // Handle the error, e.g., display an error message to the user
        }
    };
    const handleGetUser = async () => {
        try {
            const data = await getUser(userId);
            setUserData(data);
            setError('');
        } catch (e) {
            setError((e as Error).message);
            console.error('Error fetching user:', e);
        }
    };
    const handleDeleteUser = async () => {
        try {
            await deleteUser(userId);
            console.log(`User ${userId} deleted successfully`);
            // Here you might want to navigate away from the current view or reset the user state
        } catch (e) {
            console.error('Error deleting user:', e);
            // Handle the error, e.g., display an error message to the user
        }
    };
    const handleAddUser = async () => {
        try {
            const newUser = {
                // Define the user object based on your data structure
                "AllowAIMoveTasks": true,
                "ID": "80085",
                "Name": "R  ohan Shah Test",
                "ParentsOfLeafNodesByTask": {
                    "root1": [
                        "2024-02-22:::leafNode1",
                        "2024-02-23:::leafNode2"
                    ],
                    "root2": [
                        "2024-02-24:::leafNode3"
                    ]
                },
                "ProfilePicture": "https://example.com/profile.jpg",
                "Settings": {
                    "setting1": "value1",
                    "setting2": "value2"
                },
                "SharedTaskTrees": [
                    "sharedRoot1:::sharedNode1",
                    "sharedRoot2:::sharedNode2"
                ],
                "TaskTreeRoots": [
                    "root1",
                    "root2"
                ],
                "WeeklyAITimesAllowed": {
                    " Tuesday:09:00": "18:00",
                    "Monday:08:00": "17:00"
                }

            };

            const response = await addUser(newUser);
            console.log('User added:', response);
            // Handle response and update UI accordingly
        } catch (error) {
            console.error('Error adding user:', error);
            // Handle error
        }
    };

    const handleEditUser = async () => {
        try {
            const userUpdates = {
                "AllowAIMoveTasks": true,
                "ID": "80085",
                "Name": "Edit Test",
                "ParentsOfLeafNodesByTask": {
                    "root1": [
                        "2024-02-22:::leafNode1",
                        "2024-02-23:::leafNode2"
                    ],
                    "root2": [
                        "2024-02-24:::leafNode3"
                    ]
                },
                "ProfilePicture": "https://example.com/profile.jpg",
                "Settings": {
                    "setting1": "value1",
                    "setting2": "value2"
                },
                "SharedTaskTrees": [
                    "sharedRoot1:::sharedNode1",
                    "sharedRoot2:::sharedNode2"
                ],
                "TaskTreeRoots": [
                    "root1",
                    "root2"
                ],
                "WeeklyAITimesAllowed": {
                    " Tuesday:09:00": "18:00",
                    "Monday:08:00": "17:00"
                }
            };
            const response = await updateUser(userId, userUpdates);
            console.log('User updated:', response);
            // Handle response and update UI accordingly
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error
        }
    };

    

    return (
        <View>
           <Button title="Get Task" onPress={handleGetTask} />
              <Button title="Add Task" onPress={handleAddTask} />
              <Button title="Delete Task" onPress={handleDeleteTask} />
              <Button title="Edit Task" onPress={handleEditTask} />
              <Button title="Get User" onPress={handleGetUser} />
              <Button title="Delete User" onPress={handleDeleteUser} />
              <Button title="Add User" onPress={handleAddUser} />
              <Button title="Edit User" onPress={handleEditUser} />



            {task && <Text style={{color:'white'}}>{task.name}</Text>} {/* Adjust based on your task data structure */}
            {error && <Text style={{color:'white'}}>{error}</Text>}
        </View>
    );
};

export default ButtonTest;
