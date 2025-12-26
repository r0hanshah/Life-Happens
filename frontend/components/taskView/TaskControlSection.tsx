import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import TaskModel from "../../models/TaskModel";
import TaskViewController from "../../controllers/taskView/TaskViewController";
import MainController from "../../controllers/main/MainController";
import DeleteTaskSection from "./DeleteTaskSection";

const TaskControlSection: React.FC<{ task: TaskModel; newTasks: TaskModel[]; isLeft: Boolean; taskViewController: TaskViewController; mainController: MainController; fontsLoaded: boolean }> = ({ task, newTasks, isLeft, taskViewController , mainController, fontsLoaded }) => {
    const [generating, setGenerating] = useState(false)

    useEffect(()=>{
        const taskListener = mainController.getLoadingGenerateTasks();
    
        const listener = (bool: boolean) => {
          setGenerating(bool);
        };
    
        taskListener.addListener(listener)
    
        return () => {
          taskListener.removeListener(listener);
        };
    }, [mainController])
    
    return (
        <View style={{alignItems: isLeft ? 'flex-start': 'flex-end'}}>
            {task.completeness == 1 && task.children.length == 0 &&
                <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'black', borderColor:'white', borderWidth:2, margin:10}} onPress={()=>{
                    task.completeness = 0
                    taskViewController.handle_complete_toggle(0, mainController)
                }}>
                    <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>Mark as Incomplete...</Text>
                </TouchableOpacity>
            }
            {task.completeness == 0 && task.children.length == 0 &&
                <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'#86C28B', margin:10}} onPress={()=>{
                    task.completeness = 1
                    taskViewController.handle_complete_toggle(1, mainController)
                }}>
                    <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>Mark as Complete</Text>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10}}
                        source={require('../../assets/check_mark_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                </TouchableOpacity>
            }

            <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'rgba(50, 50, 50, 1)', margin:10}} 
            onPress={async ()=>{
                if(!generating)
                {
                    const generatedTasks = await MainController.getInstance().handleGenerateTasks(task)
                    newTasks.concat(generatedTasks)
                }
                }}>

                <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>{generating ? "Generating Sub Tasks...": "Generate Sub Tasks"}</Text>
                {generating && 
                    <ActivityIndicator size="small" color="#ffffff" style={{width: 20, height: 20, marginHorizontal: 10}}/>
                }
                {!generating &&
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10}}
                        source={require('../../assets/robot_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                }

            </TouchableOpacity>

            <DeleteTaskSection task={task} isLeft={isLeft} fontsLoaded={fontsLoaded} mainController={mainController}/>

        </View>
    );
}

export default TaskControlSection; 