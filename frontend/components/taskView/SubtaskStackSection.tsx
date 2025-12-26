import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import TaskModel from "../../models/TaskModel";

import TaskViewController from "../../controllers/taskView/TaskViewController";
import MainController from "../../controllers/main/MainController";

import CircularProgressBar from "./CircularProgressView";
import TaskMetaData from "./TaskMetaData";

const SubtaskStackSection: React.FC<{ parentTask: TaskModel; newTasks: TaskModel[]; isLeft: Boolean; fontsLoaded: Boolean, taskViewController: TaskViewController, mainController: MainController }> = ({ parentTask, newTasks, isLeft, fontsLoaded, taskViewController, mainController }) => {
    
    const [generating, setGenerating] = useState(false)
    const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null)

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
        <View style={{alignItems: isLeft? 'flex-start' : 'flex-end', marginTop:20}}>

            {parentTask.children.map((task, index) => (
                <TouchableOpacity key={index} style={{ width:'95%', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:30, alignItems: selectedTask && selectedTask.id == task.id ? 'flex-start' : 'center', marginVertical: 10, zIndex:-index}} onPress={()=>{
                    if (selectedTask && selectedTask.id == task.id)
                    {
                        MainController.getInstance().setSelectedTask(selectedTask)
                    }
                    else
                    {
                        setSelectedTask(task)
                    }
                    
                    }}>
                        <View style={{flexDirection:isLeft? 'row' : 'row-reverse', justifyContent:'space-between', alignItems:'center', width:'100%', height:50}}>
                            <View style={{flexDirection:isLeft? 'row' : 'row-reverse', alignItems:'center'}}>
                                <View style={{backgroundColor:task.color, width: 20, height:20, borderRadius:20, margin:10}}/>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{color:'white', width: 200, overflow:'hidden'}}>{task.title}</Text>
                            </View>
                            <Text style={{color:'white'}}>{task.children.length == 0 ? 'Leaf Task' : task.children.length +' Sub Tasks'}</Text>
                            <View style={{flexDirection: 'row', marginHorizontal: 20, padding: 10, alignItems:'center'}}>

                                    <CircularProgressBar percentage={task.getPercentCompleteness()} task={task}/>

                                    <Text style={{color: 'gray'}}>{(task.getPercentCompleteness()*100).toFixed(1)}%</Text>

                            </View>
                            <View style={[{height:2, width: 50, position:'absolute', backgroundColor:task.color}, isLeft?{ marginLeft:-50} : { marginRight:-50}]}></View>
                            <View style={[{height:420, width: 1.5, position:'absolute', backgroundColor:task.color, marginTop:-418}, isLeft ? {marginLeft:-50.0} : {marginRight:-50.0}]}></View>
                        </View>

                        {(selectedTask && selectedTask.id == task.id) && 
                            <View style={[{width:'100%', zIndex:4, paddingHorizontal:25, paddingBottom:20}]}>

                                <TaskMetaData task={task} isLeft={isLeft} taskViewController={taskViewController} mainController={mainController}/>

                                { task.children.length == 0 &&
                                    <View>    
                                        {task.completeness == 1 && task.children.length == 0 &&
                                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:40, width:"100%", borderRadius:10, backgroundColor:'black', borderColor:'white', borderWidth:2, margin:10, marginTop:20}} onPress={()=>{
                                                task.completeness = 0
                                                const subTaskController = new TaskViewController(task)
                                                subTaskController.handle_complete_toggle(0, mainController)
                                            }}>
                                                <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>Mark as Incomplete...</Text>
                                            </TouchableOpacity>
                                        }
                                        {task.completeness == 0 && task.children.length == 0 &&
                                            <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:40, width:"100%", borderRadius:10, backgroundColor:'#86C28B', margin:10, marginTop:20}} onPress={()=>{
                                                task.completeness = 1
                                                const subTaskController = new TaskViewController(task)
                                                subTaskController.handle_complete_toggle(1, mainController)
                                            }}>
                                                <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>Mark as Complete</Text>
                                                <Image
                                                    style={{width: 20, height: 20, marginHorizontal: 10}}
                                                    source={require('../../assets/check_mark_icon.png')}
                                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                                />
                                            </TouchableOpacity>
                                        }
                                    </View>
                                }
                                
                            </View>
                        }
                        
                    
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'rgba(50, 50, 50, 1)', margin:10, marginTop:40, zIndex:-999}} onPress={async ()=>{
                if (!generating)
                {
                    const generatedTasks = await MainController.getInstance().handleGenerateTasks(parentTask)
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

        </View>
    );
};

export default SubtaskStackSection;