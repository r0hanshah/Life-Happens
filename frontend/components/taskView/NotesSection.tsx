import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from 'react-native';

import TaskModel from "../../models/TaskModel";
import TaskViewController from "../../controllers/taskView/TaskViewController";
import MainController from "../../controllers/main/MainController";

const NotesSection: React.FC<{task: TaskModel, isLeft: Boolean, fontsLoaded: Boolean, taskViewController: TaskViewController, mainController: MainController}> = ({task, isLeft, fontsLoaded, taskViewController, mainController}) => {
    
    const [text, setText] = useState(task.notes);

    useEffect(() => {
        setText(task.notes);
    }, [task.notes]);

    const onChangeText = (newText: React.SetStateAction<string>) => {
        setText(newText);
        task.notes = newText.valueOf().toString()
        taskViewController.handle_notes_change(task.notes, mainController)
    };

    const onSubmitEditing = () => {
        // Handle submission logic here
        console.log('Submitted text:', text);
    };
    
    return (
        <View style={[{ width: '100%', marginTop: 20 }, isLeft ? { paddingRight: 30 } : { paddingLeft: 35 }]}>
            <Text style={{ color: 'white', fontFamily: fontsLoaded ? 'Inter_900Black' : 'Arial', fontSize: 20 }}>Notes</Text>
            <TextInput
                style={{ width: "100%", color: 'white', backgroundColor: 'rgba(50, 50, 50, 1)', borderRadius: 5, minHeight: 300, marginTop: 10, padding: 10, justifyContent: 'flex-start' }}
                onChangeText={onChangeText}
                value={text}
                multiline={true}
                placeholder="Enter text here..."
                onSubmitEditing={onSubmitEditing}
            />
        </View>
    );
}

export default NotesSection;