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

    type TaskData = {
        Ancestors: string[],
        Children: string[],
        Content: {
            field1: string,
            field2: string
        },
        ContextFiles: string[],
        ContextText: string,
        CreatorID: string,
        DueDate: string,
        EndDate: string,
        ExpectedTimeOfCompletion: number,
        ExtraMedia: string[],
        ID: string,
        InvitedUsers: string[],
        IsMovable: boolean,
        Notes: string,
        StartDate: string,
        Title: string,
        Users: string[],
        isRoot: boolean
    };
    
    const handleAddTask = async (userId: string, newTaskData: TaskData) => {
        console.log('handleAddTask called');
        try {
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
    const handleEditTask = async (userId: string, taskId: string, taskData: TaskData) => {
        try {
            await updateTask(userId, taskId, taskData);
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
    
    const handleAddUser = async (newUser: UserData) => {
        try {
            const response = await addUser(newUser);
            console.log('User added:', response);
            // Handle response and update UI accordingly
        } catch (error) {
            console.error('Error adding user:', error);
            // Handle error
        }
    };
    
    const handleEditUser = async (userId: string, userUpdates: UserData) => {
        try {
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
              <Button title="Add Task" onPress={() => handleEditTask("userID456", "taskID456", {
                                                                        Ancestors: ["taskID789"],
                                                                        Children: ["subtask3", "subtask4"],
                                                                        Content: {
                                                                            field1: "Updated Field1",
                                                                            field2: "Updated Field2"
                                                                        },
                                                                        ContextFiles: ["https://example.com/files/updated_context.docx"],
                                                                        ContextText: "Updated important context",
                                                                        CreatorID: "creatorID456",
                                                                        DueDate: "2024-06-01",
                                                                        EndDate: "2024-05-30",
                                                                        ExpectedTimeOfCompletion: 15,
                                                                        ExtraMedia: ["https://example.com/images/updated_image.jpg"],
                                                                        ID: "taskID456",
                                                                        InvitedUsers: ["newuser@example.com"],
                                                                        IsMovable: false,
                                                                        Notes: "Updated notes with additional links",
                                                                        StartDate: "2024-05-15",
                                                                        Title: "Updated Project Planning",
                                                                        Users: ["userID789", "userID101112"],
                                                                        isRoot: false
                                                                    })} />
              <Button title="Delete Task" onPress={handleDeleteTask} />
              <Button title="Edit Task" onPress={() => handleAddTask("userID123", {
                                                                        Ancestors: ["taskID123"],
                                                                        Children: ["subtask1", "subtask2"],
                                                                        Content: {
                                                                            field1: "First Field",
                                                                            field2: "Second Field"
                                                                        },
                                                                        ContextFiles: ["https://example.com/files/context.pdf"],
                                                                        ContextText: "Important context here",
                                                                        CreatorID: "creatorID123",
                                                                        DueDate: "2024-05-01",
                                                                        EndDate: "2024-04-30",
                                                                        ExpectedTimeOfCompletion: 10,
                                                                        ExtraMedia: ["https://example.com/images/image.png"],
                                                                        ID: "taskID456",
                                                                        InvitedUsers: ["user@example.com"],
                                                                        IsMovable: true,
                                                                        Notes: "Remember to review all documents",
                                                                        StartDate: "2024-04-15",
                                                                        Title: "Project Planning",
                                                                        Users: ["userID123", "userID456"],
                                                                        isRoot: true
                                                                    })} />
              <Button title="Get User" onPress={handleGetUser} />
              <Button title="Delete User" onPress={handleDeleteUser} />
              <Button title="Add User" onPress={() => handleAddUser({
                                                                AllowAIMoveTasks: true,
                                                                ID: "newUser123",
                                                                Name: "Jane Doe",
                                                                ParentsOfLeafNodesByTask: { "task1": ["node1", "node2"] },
                                                                ProfilePicture: "https://example.com/profile/jane.jpg",
                                                                Settings: { theme: "dark", notifications: true },
                                                                SharedTaskTrees: ["tree1", "tree2"],
                                                                TaskTreeRoots: ["root1", "root2"],
                                                                WeeklyAITimesAllowed: 5})} />
              <Button title="Edit User" onPress={() => handleEditUser("existingUser456", {
                                                            AllowAIMoveTasks: false,
                                                            ID: "existingUser456",
                                                            Name: "John Smith",
                                                            ParentsOfLeafNodesByTask: { "task2": ["node3", "node4"] },
                                                            ProfilePicture: "https://example.com/profile/john.jpg",
                                                            Settings: { theme: "light", notifications: false },
                                                            SharedTaskTrees: ["tree3", "tree4"],
                                                            TaskTreeRoots: ["root3", "root4"],
                                                            WeeklyAITimesAllowed: 3}) }/>



            {task && <Text style={{color:'white'}}>{task.name}</Text>} {/* Adjust based on your task data structure */}
            {error && <Text style={{color:'white'}}>{error}</Text>}
        </View>
    );
};

export default ButtonTest;
