import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, StyleProp, ViewStyle, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import TaskModel from '../../../models/TaskModel';
import { useFonts } from 'expo-font';
import { Inter_500Medium } from '@expo-google-fonts/inter';
import CircularProgressBar from '../CircularProgressView';

const { width, height } = Dimensions.get('window');

interface TreeNodeProps {
    style?: StyleProp<ViewStyle>
    task:TaskModel
}

const TreeNode: React.FC<TreeNodeProps> = ({task, style}) => {

  let [fontsLoaded] = useFonts({
    Inter_500Medium
  });

  const x_offset = task.ancestors.length > 0 ? (-5 - (Math.abs(task.ancestors[0].x - task.x >= 1 ? task.ancestors[0].x - task.x: 0))*230)*Math.abs(task.ancestors[0].x - task.x >= 1 ? task.ancestors[0].x - task.x: 1) : 0

  return (
    <View style={[style, {width: 220, height:40, borderRadius:20, backgroundColor:'#383838', flexDirection:'row', justifyContent:'space-around', alignItems:'center'}]}>
        
        { task.ancestors.length > 0 &&

        <>
          <View style={{position:'absolute', width:1, height:40, bottom:40, backgroundColor:'gray'}}/>
          <View style={[{
            position:'absolute', 
            width: Math.abs(task.ancestors[0].x - task.x) * 230, 
            height:1, 
            bottom:80,
          },
            task.ancestors[0].x - task.x < 0 ?
            {
              left:0,
              backgroundColor:'red'
            } 
            :
            {
              right:0,
              backgroundColor:'green'
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
        <View style={{position:'absolute', width:1, height:40, top:40, backgroundColor:'gray'}}/>

        }
    </View>
  );
};

export default TreeNode;