import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity} from 'react-native';

import TaskModel from "../../models/TaskModel";
import DateSelector from "./DateSelector";
import TimeSelector from "./TimeSelector";
import TaskViewController from "../../controllers/taskView/TaskViewController";
import MainController from "../../controllers/main/MainController";

const TaskMetaData: React.FC<{task: TaskModel, isLeft: Boolean, taskViewController: TaskViewController, mainController: MainController}> = ({task, isLeft, taskViewController, mainController}) => {

    const [isMovable, setIsMovable] = useState(task.isMovable)
    const [duration, setDuration] = useState(calculateDuration(task.startDate, task.endDate));
    const [durationFromNow, setDurationFromNow] = useState(calculateDuration(new Date(), task.endDate));

    const [startNotify, setStartNotify] = useState(task.startNotify)
    const [endNotify, setEndNotify] = useState(task.endNotify)
    
    useEffect(()=>{
        setStartNotify(task.startNotify); 
        setEndNotify(task.endNotify)},
        [task]
    )
    
    return (
        <View style={[{width:'100%', zIndex:4}, isLeft? {paddingRight: 30} : {paddingLeft:25}]}>
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:20, zIndex:4}}>
                <View style={{flexDirection:'row'}}>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                        source={require('../../assets/calendar_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                    <TouchableOpacity onPress={()=>{
                        taskViewController.handle_toggle_notifications(!startNotify, mainController, 'start_task')
                        setStartNotify(!startNotify)
                        }}>
                        <Image
                            style={{width: 20, height: 20, marginRight: 10, opacity: startNotify ? 1 : 0.3, transform: startNotify ? 'rotate(45deg)' : 'rotate(0deg)'}}
                            source={require('../../assets/bell-icon.png')}
                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                        />
                    </TouchableOpacity>
                    <Text style={{color:'gray'}}>Start Date</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <DateSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></DateSelector>
                    <TimeSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></TimeSelector>
                </View>
                
                {/* <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text> */}
            </View>
            
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10, zIndex:3}}>
                <View style={{flexDirection:'row'}}>
                <Image
                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                    source={require('../../assets/calendar_icon.png')}
                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                />
                <TouchableOpacity onPress={()=>{
                        taskViewController.handle_toggle_notifications(!endNotify, mainController, 'end_task')
                        setEndNotify(!endNotify)
                        }}>
                    <Image
                        style={{width: 20, height: 20, marginRight: 10, opacity: endNotify ? 1 : 0.3, transform: endNotify ? 'rotate(45deg)' : 'rotate(0deg)'}}
                        source={require('../../assets/bell-icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                </TouchableOpacity>
                <Text style={{color:'gray'}}>End Date</Text>
                </View>
                <View style={{flexDirection:'row'}}>
                    <DateSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></DateSelector>
                    <TimeSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></TimeSelector>
                </View>
                {/* <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text> */}
            </View>
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                <View style={{flexDirection:'row'}}>
                <Image
                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                    source={require('../../assets/clock_icon.png')}
                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                />
                <Text style={{color:'gray'}}>{task.children.length > 0 ? "Span" : "Duration"}</Text>
                </View>
                <Text style={{color:'gray'}}>{duration}</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                <View style={{flexDirection:'row'}}>
                <Image
                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                    source={require('../../assets/clock_icon.png')}
                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                />
                <Text style={{color:'gray'}}>{task.children.length > 0 ? "Span" : "Duration"} From Now</Text>
                </View>
                <Text style={{color:'gray'}}>{durationFromNow}</Text>
            </View>
            { task.children.length == 0 &&
                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                    <View style={{flexDirection:'row'}}>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                        source={require('../../assets/robot_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                    <Text style={{color:'gray'}}>Is Movable?</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{task.isMovable = task.isMovable ? false : true; setIsMovable(task.isMovable);mainController.saveEditToTask(task)}}>
                        <Text style={{color:'gray'}}>{isMovable ? 'Yes' : 'No'}</Text>
                    </TouchableOpacity>
                </View>
            }
            
        </View>
    );
};

const calculateDuration = (startDate:Date, endDate:Date) => {
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
};

export default TaskMetaData;