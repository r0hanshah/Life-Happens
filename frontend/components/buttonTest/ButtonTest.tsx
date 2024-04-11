// ButtonTest.tsx
import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { getTask } from '../../services/taskServices'; // Adjust the import path as necessary

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
            console.log('Fetched task:', fetchedTask);
            setError('');
        } catch (e) {
            setError((e as Error).message);
            console.log('Error:', e);
        }
    };

    return (
        <View>
           <Button title="Get Task" onPress={handleGetTask} />

            {task && <Text style={{color:'white'}}>{task.name}</Text>} {/* Adjust based on your task data structure */}
            {error && <Text style={{color:'white'}}>{error}</Text>}
        </View>
    );
};

export default ButtonTest;
