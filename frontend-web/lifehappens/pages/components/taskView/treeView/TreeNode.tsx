import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle, Text, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import TaskModel from '../../../models/TaskModel';
import { useFonts } from 'expo-font';
import { Inter_500Medium } from '@expo-google-fonts/inter';
import CircularProgressBar from '../CircularProgressView';
import MainController from '../../../controllers/main/MainController';

const { width, height } = Dimensions.get('window');

interface TreeNodeProps {
    style?: StyleProp<ViewStyle>
    task:TaskModel
    pathColor:string
}

const TreeNode: React.FC<TreeNodeProps> = ({task, style, pathColor}) => {

  let [fontsLoaded] = useFonts({
    Inter_500Medium
  });

  const mainController = MainController.getInstance()

  const x_offset = 109.5

  return (
    <TouchableOpacity 
    onPress={()=>{
      mainController.setSelectedTask(task)
    }}
    style={[style, {width: 220, height:40, borderRadius:20, backgroundColor:'#383838', flexDirection:'row', justifyContent:'space-around', alignItems:'center', zIndex: pathColor != 'gray' ? 999 : 1}]}>
        
        { task.ancestors.length > 0 &&

        <>
          <View style={{position:'absolute', width:1, height:40, bottom:40, backgroundColor: pathColor}}/>
          <View style={[{
            position:'absolute', 
            width: Math.abs(task.ancestors[0].x - task.x) * 230 + 0.5, 
            height:1, 
            bottom:80,
            backgroundColor: pathColor
          },
            task.ancestors[0].x < task.x ?
            {
              right:x_offset,
            } 
            :
            {
              left:x_offset,
            }]}/>
        </>

        }

        <View style={{width:10, height:10, borderRadius:5, backgroundColor:task.color, marginHorizontal:10}}/>
        
        <Text style={{
            color: '#fff',
            fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial',
            maxWidth:120,
            fontSize: 10
        }}>{task.title}</Text>

        <View style={{flexDirection: 'row', marginHorizontal: 20, padding: 10, alignItems:'center'}}>

          <CircularProgressBar percentage={task.getPercentCompleteness()} task={task}/>

          <Text style={{color: 'gray', fontSize:10}}>{(task.getPercentCompleteness()*100).toFixed(1)}%</Text>

        </View>

        { task.children.length > 0 &&

        // Check if there are children
        <View style={{position:'absolute', width:1, height:40, top:40, backgroundColor: task.id == mainController.getSelectedTask().getValue()?.id ? 'gray' : pathColor}}/>

        }
    </TouchableOpacity>
  );
};

export default TreeNode;