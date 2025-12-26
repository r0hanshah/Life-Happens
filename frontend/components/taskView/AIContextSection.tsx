import React, { useEffect, useState } from "react";
import { View, Text, TextInput } from 'react-native';

import TaskModel from "../../models/TaskModel";
import MainController from "../../controllers/main/MainController";

const AIContextSection: React.FC<{task: TaskModel, isLeft: Boolean, fontsLoaded: Boolean, mainController: MainController}> = ({task, isLeft, fontsLoaded, mainController}) => {
    
    const [context, setContext] = useState(task.contextText);

    useEffect(() => {
        setContext(task.contextText);
    }, [task]);
    
    const onChangeContext = (newText: React.SetStateAction<string>) => {
        setContext(newText);
        task.contextText = newText.valueOf().toString()
        mainController.saveEditToTask(task)
    };

    const onSubmitContextEditing = () => {
        // Handle submission logic here
        console.log('Submitted text:', context);
    };

    return (
        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Context Prompt</Text>
                <Text style={{color:'gray'}}>{context.length}/300</Text>
            </View>
            
            <TextInput
                style={{width:"100%", color:'white', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:5, minHeight: 200, marginTop:10, padding:10, justifyContent:'flex-start'}}
                onChangeText={onChangeContext}
                value={context}
                multiline={true}
                placeholder="Enter context here..."
                onSubmitEditing={onSubmitContextEditing}
            />
        </View>
    );
}

export default AIContextSection;