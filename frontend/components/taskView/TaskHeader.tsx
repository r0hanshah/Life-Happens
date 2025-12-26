import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

import InviteUser from './InviteUser';
import CircularProgressBar from './CircularProgressView';

import MainController from '../../controllers/main/MainController';
import TaskViewController from '../../controllers/taskView/TaskViewController';

import TaskModel from '../../models/TaskModel';
import UserModel from '../../models/UserModel';
import TraceBackSection from './TraceBackSection';


const TaskHeader: React.FC<{task: TaskModel, currentUser: UserModel, isLeft: Boolean}> = ({task, currentUser, isLeft}) => {
    let [fontsLoaded] = useFonts({Inter_900Black});

    const controllerRef = useRef(new TaskViewController(task));
    const controller = controllerRef.current;
    const mainController = MainController.getInstance();

    const [title, setTitle] = useState(task.title)
    const [viewUsers, setViewUsers] = useState(false)
    const [completion, setCompletion] = useState(task.getPercentCompleteness())

    const inviterId = currentUser ? currentUser.id : null;

    useEffect(() => {
        setTitle(task.title)
        setCompletion(task.getPercentCompleteness())
    }, [task]);

    useEffect(() => {
        const taskListener = controller.getViewInvitedUsers();
        setCompletion(task.getPercentCompleteness())
  
        const listener = (bool: boolean) => {
          setViewUsers(bool);
        };
  
        taskListener.addListener(listener)
  
        return () => {
          taskListener.removeListener(listener);
        };
    }, [controller]);

    const onChangeTitle = (newText: React.SetStateAction<string>) => {
        setTitle(newText);
        task.title = newText.toString()
        controller.handle_title_change(task.title, mainController)
    }

    return (
    <>
        <Text style={{color: 'white'}}>Created by: {mainController.getUser().getValue()?.name}</Text> {/* Get creator name */}
        <View style={[{width: "100%", flexDirection: isLeft ? 'row': 'row-reverse', alignItems: 'flex-end', justifyContent:'space-between'}, isLeft? {paddingRight: 30} : {paddingLeft:25}]}>

        <View style={{flexDirection: isLeft ? 'row': 'row-reverse', width:'70%', alignItems:'flex-end'}}>
            <TextInput 
            style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:40, textAlign: isLeft ? 'left' : 'right', textAlignVertical:'bottom', minWidth:'70%', height: Math.max(50, (title.split('\n').length + Math.max(0, Math.ceil(title.replace(/\s+/g, '').length / 13)) - 1) * 50)}}
            scrollEnabled={false}
            onChangeText={onChangeTitle}
            value={title}
            multiline={true}
            placeholder='Task Title...'
            />
        </View>
        
        <View style={{flexDirection:'column'}}>
            {/*TODO: Generate this part of the task view*/}
            <View style={{flexDirection: 'row', paddingVertical: 10, alignItems:'center'}}>
                                            
                <CircularProgressBar percentage={task.getPercentCompleteness()} task={task}/>

                <Text style={{color: 'gray'}}>{(completion*100).toFixed(1)}%</Text>

            </View>

            <View style={{flexDirection: 'row', height: 50, width:100, backgroundColor:'black', borderRadius: 30, borderColor: 'white', borderWidth: 2, alignItems:'center', justifyContent:'center'}}>
                
                <TouchableOpacity onPress={()=>{controller.setInvitedUsers(true)}}>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10, opacity: !viewUsers ? 0.3 : 1}}
                        source={require('../../assets/people_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                </TouchableOpacity>
            
                <TouchableOpacity onPress={()=>{controller.setInvitedUsers(false)}}>
                        <Image
                            style={{width: 20, height: 20, marginHorizontal: 10,  opacity: viewUsers ? 0.3 : 1}}
                            source={require('../../assets/parent_tasks_icon.png')}
                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                        />
                </TouchableOpacity>
                
            </View>
        </View>
        
    </View>
    {/* Display users/ancestor tasks */}
    {!viewUsers && task.ancestors.length > 0 && <TraceBackSection task={task} isLeft={isLeft} fontsLoaded={fontsLoaded} />}
    {viewUsers && <InviteUser taskId={task.id} inviterId={inviterId} />}
  </>
  );
};

export default TaskHeader;