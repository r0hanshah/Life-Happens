import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';


import TaskModel from '../../models/TaskModel';
import MainController from '../../controllers/main/MainController';


import DateSelector from './DateSelection';
import TimeSelector from './TimeSelector';

interface CreateTaskViewProps {
  parentTask: TaskModel;
  task: TaskModel;
  isLeft: Boolean;
  zIndex: number;
  handleDeleteNewTask: (task:TaskModel) => void;
}

const CreateTaskView: React.FC<CreateTaskViewProps> = ({ parentTask, task, isLeft, zIndex, handleDeleteNewTask }) => {

  const [isMovable, setIsMovable] = useState(task.isMovable)

  let [fontsLoaded] = useFonts({
    Inter_900Black
  });

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

  const handleAddTask = () => {
    parentTask.children.push(task)
    handleDeleteNewTask(task)
    const mainController = MainController.getInstance();
    mainController.setReRender(mainController.getReRender().getValue() ? false : true)
  }

  // For date pickers
    const [duration, setDuration] = useState(calculateDuration(task.startDate, task.endDate));
    const [durationFromNow, setDurationFromNow] = useState(calculateDuration(new Date(), task.endDate));


  return(
    <View style={{alignItems: isLeft? 'flex-start' : 'flex-end', marginTop:20, zIndex:zIndex}}>
        <View style={{flexDirection:'column', alignItems:'flex-start',  height:300, width:'95%', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:30, zIndex:zIndex}}>
            <View  style={{flexDirection:isLeft? 'row' : 'row-reverse', justifyContent:'space-between', marginTop: 10, width:'100%', alignItems:'center'}}>
                    
                    <View style={{flexDirection:isLeft? 'row' : 'row-reverse', alignItems:'center'}}>
                        <View style={{backgroundColor:task.color, width: 20, height:20, borderRadius:20, margin:10}}/>
                        <Text style={{color:'white'}}>{task.title}</Text>
                    </View>
                    <Text style={{color:'white'}}>Leaf Task</Text>
                    <View style={{flexDirection: 'row', marginHorizontal: 20, padding: 10, alignItems:'center'}}>
                            
                            <View style={{width: 30, height: 30, borderRadius: 30, borderWidth: 2, borderColor: 'gray', marginRight:10}}></View>

                            <Text style={{color: 'gray'}}>0%</Text>

                    </View>
                    <View style={[{height:2, width: 50, position:'absolute', backgroundColor:task.color}, isLeft?{ marginLeft:-50} : { marginRight:-50}]}></View>
                    <View style={[{height:320, width: 1.5, position:'absolute', backgroundColor:task.color, marginTop:-318}, isLeft ? {marginLeft:-50.0} : {marginRight:-50.0}]}></View>
                
            </View>

            {/* Set start date and end date and say whether the event is movable */}
            <View style={[{width:'100%', paddingHorizontal:25}]}>
                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:20, zIndex:4}}>
                    <View style={{flexDirection:'row'}}>
                        <Image
                            style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                            source={require('../../assets/calendar_icon.png')}
                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                        />
                        <Text style={{color:'gray'}}>Start Date</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <DateSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]}></DateSelector>
                        <TimeSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]}></TimeSelector>
                    </View>
                </View>
                
                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10, zIndex:3}}>
                    <View style={{flexDirection:'row'}}>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                        source={require('../../assets/calendar_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                    <Text style={{color:'gray'}}>End Date</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <DateSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]}></DateSelector>
                        <TimeSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]}></TimeSelector>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                    <View style={{flexDirection:'row'}}>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                        source={require('../../assets/clock_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                    <Text style={{color:'gray'}}>Duration</Text>
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
                    <Text style={{color:'gray'}}>Duration From Now</Text>
                    </View>
                    <Text style={{color:'gray'}}>{durationFromNow}</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                    <View style={{flexDirection:'row'}}>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                        source={require('../../assets/robot_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />
                    <Text style={{color:'gray'}}>Is Movable?</Text>
                    </View>
                    <TouchableOpacity onPress={()=>{task.isMovable = task.isMovable ? false : true; setIsMovable(task.isMovable)}}>
                        <Text style={{color:'gray'}}>{isMovable ? 'Yes' : 'No'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Cancel or Create sub task */}
            <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', paddingHorizontal: 25, paddingVertical:10, zIndex:-1}}>
                <TouchableOpacity style={{ width:200, backgroundColor:'#151515', height: 40, borderRadius:50, borderWidth:2, borderColor:'red', justifyContent:'center', alignItems:'center'}} onPress={()=>{handleDeleteNewTask(task)}}>
                    <Text style={{color:'white'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width:200, backgroundColor:'#151515', height: 40, borderRadius:50, borderWidth:2, borderColor:'white', justifyContent:'center', alignItems:'center'}} onPress={handleAddTask}>
                    <Text style={{color:'white'}}>Create Sub Task</Text>
                </TouchableOpacity>
            </View>


        </View>
        
    </View>
  );
};

export default CreateTaskView;