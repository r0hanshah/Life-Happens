import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from 'react-native';

import TaskModel from "../../models/TaskModel";
import MainController from "../../controllers/main/MainController";
import CreateSubTaskView from "./CreateSubTaskView";
import SubtaskStackSection from "./SubtaskStackSection";
import TaskViewController from "../../controllers/taskView/TaskViewController";

const SubtaskSection: React.FC<{ task: TaskModel; isLeft: Boolean; fontsLoaded: boolean; taskViewController: TaskViewController; mainController: MainController }> = ({ task, isLeft, fontsLoaded, taskViewController, mainController }) => {
    
    const [newTasks, setNewTasks] = useState<TaskModel[]>([]);

    const handleDeleteNewTask = (taskToDelete:TaskModel) => {
        setNewTasks(newTasks.filter(task => task.id !== taskToDelete.id))
    }
    
    return (
        <View style={{width:'100%'}}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>

                <Text style={[{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:40}, {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>{task.children.length} Sub tasks</Text>

                <TouchableOpacity style={{
                    justifyContent:'center', 
                    alignItems:'center', 
                    width:30, 
                    height:30, 
                    backgroundColor:'rgba(50,50,50,1)', 
                    borderRadius:30, 
                    margin:5, 
                    marginRight:isLeft ? 20 : 0}} 
                    onPress={()=>{
                        setNewTasks([...newTasks, new TaskModel(undefined, task.creatorId, task.rootId, task.users, undefined, "Sub Task " + (task.children.length + newTasks.length + 1), task.color, [task ,...task.ancestors], undefined, task.startDate.toISOString(), task.endDate.toISOString(), false, mainController.getUser().getValue()!.settings["allow_start_time_email_notif"],mainController.getUser().getValue()!.settings["allow_end_time_email_notif"])])
                        }}>
                    <Image
                        style={{width: 10, height: 10, marginHorizontal: 10, transform:[{rotate: '45deg'}], margin:5}}
                        source={require('../../assets/x_mark_white.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                </TouchableOpacity>

            </View>

            {newTasks.length > 0 &&  
                newTasks.toReversed().map((newTask, index) => (
                    <CreateSubTaskView parentTask={task} task={newTask} isLeft={isLeft} zIndex={newTasks.length - index} handleDeleteNewTask={handleDeleteNewTask}/>
                ))
            }

            {task.children.length > 0 &&
                <SubtaskStackSection parentTask={task} newTasks={newTasks} isLeft={isLeft} fontsLoaded={fontsLoaded} taskViewController={taskViewController} mainController={mainController}/>
            }

        </View>
    );
}

export default SubtaskSection;