// ButtonTest.tsx
import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { getTask, addTask, deleteTask } from '../../services/taskServices'; // Adjust the import path as necessary


interface Task {
    name: string; // Adjust based on your task data structure
}

const ButtonTest = ({ userId, taskId }: { userId: string, taskId: string }) => {
    const [task, setTask] = useState<Task | null>(null); // Provide type for task
    const [error, setError] = useState('');

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

    

    return (
        <View>
            <Button title="Get Task" onPress={handleGetTask} />
            <Button title="Add Task" onPress={handleAddTask} />
            <Button title="Delete Task" onPress={handleDeleteTask} />


            {task && <Text style={{color:'white'}}>{task.name}</Text>} {/* Adjust based on your task data structure */}
            {error && <Text style={{color:'white'}}>{error}</Text>}
        </View>
    );
};

export default ButtonTest;
