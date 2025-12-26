import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import TaskModel from '../../models/TaskModel';
import MainController from '../../controllers/main/MainController';

const TraceBackSection:React.FC<{task: TaskModel, isLeft: Boolean, fontsLoaded: boolean}> = ({task, isLeft, fontsLoaded}) => {
    return (
        <View style={{width:'100%'}}>
            <View style={{alignItems: isLeft? 'flex-start' : 'flex-end', marginTop:20, flexDirection:'row-reverse'}}>

                {task.ancestors.toReversed().map((task, index) => (
                    <TouchableOpacity style={{flexDirection:isLeft? 'row' : 'row-reverse', justifyContent:'space-between', height:50, width:220, backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:5, alignItems:'center', margin: 10}} onPress={()=>{MainController.getInstance().setSelectedTask(task)}}>
                        
                            <View style={{flexDirection:isLeft? 'row' : 'row-reverse', alignItems:'center'}}>
                                <View style={{backgroundColor:task.color, width: 20, height:20, borderRadius:20, margin:10}}/>
                                <View style={{alignItems:isLeft?'flex-start':'flex-end'}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', width:160, textAlign:isLeft? 'left' : 'right'}}>{task.title}</Text>
                                    <Text style={{color:'gray'}}>{index == task.children.length-1 ? 'Root' : 'Level ' + index}</Text>
                                </View>
                            </View>
                        
                    </TouchableOpacity>
                ))}

            </View>
            
        </View>
    );
};

export default TraceBackSection;