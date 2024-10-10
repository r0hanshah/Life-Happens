import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, TouchableHighlight, Image } from 'react-native';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import TaskModel from '../../../models/TaskModel';

import MainController from '../../../controllers/main/MainController';
import CircularProgressBar from '../../taskView/CircularProgressView';

interface ListItemProps
{
    rootTask: TaskModel
    leftBound: boolean
    index:number
    lowerDate:Date
    higherDate:Date
}

const ListItem: React.FC<ListItemProps> = ({ rootTask, leftBound, index, lowerDate, higherDate }) => 
{
    const controller = MainController.getInstance();

    let display = controller.getDisplay().getValue()

    leftBound = display == 2 ? true : leftBound

    const windowWidth = useWindowDimensions().width;

    const getNumberOfLeafTasksBefore = (node:TaskModel) => {
        if (node.children.length === 0 && node.startDate < lowerDate) {
            return 1;
          }
          
          // Initialize count for leaf nodes before the given date
          let count = 0;
        
          // Recursively check each child node
          for (const child of node.children) {
            count += getNumberOfLeafTasksBefore(child);
          }
        
          return count;
    }
    
    const getNumberOfLeafTasksAfter = (node:TaskModel) => {
        if (node.children.length === 0 && node.startDate > higherDate) {
            return 1;
          }
          
          // Initialize count for leaf nodes before the given date
          let count = 0;
        
          // Recursively check each child node
          for (const child of node.children) {
            count += getNumberOfLeafTasksAfter(child);
          }
        
          return count;
    }

    let [fontsLoaded] = useFonts({
        Inter_500Medium
      });

    return (
        

            <View  key={rootTask.id} style={{height: 50, width: "auto", flexDirection: "row", overflow:"visible", marginBottom: 10, justifyContent: leftBound ? "flex-start" : "flex-end"}}>

                {/* <View style={{width: 2, height: 195 + index * 60, backgroundColor: rootTask.color, bottom: 168 + index * 60, display: leftBound ? "flex": "none"}}/> */}
                <View style={{width: windowWidth*(display == 2 ? 0.009 : 0.018), height: 2, backgroundColor: rootTask.color, marginTop: 25, marginLeft:1, display: leftBound ? "flex": "none"}}/>

                    <TouchableHighlight style={{borderRadius: 25}} onPress={() => controller.setSelectedTask(rootTask)}>
                        
                        <View style={[styles.container, {flexDirection: leftBound ? 'row' : 'row-reverse', width: windowWidth * (display == 2 ? 0.80 : 0.395), justifyContent: "flex-start"}]}>

                            <>
                                <View style={[styles.circle, {backgroundColor: rootTask.color, display: "flex"}]}/>

                                <Text style={{
                                    color: '#fff',
                                    fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial'
                                }}>{rootTask.title}</Text>
                            </>

                            <View style={{flexDirection:'row', marginHorizontal:50, alignItems:'center'}}>
                                <Text style={{
                                    color: '#fff',
                                    fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial',
                                    marginHorizontal:5
                                }}>{getNumberOfLeafTasksBefore(rootTask)}</Text>
                                <Image source={require('../../../assets/triangle_right.png')} style={{
                                    width:20, height:20, opacity: 0.2, marginHorizontal:5, transform: [{ rotate: '180deg' }]
                                }}/>

                                {windowWidth > 800 && 
                                    <View style={{flexDirection: 'row', marginHorizontal: 10, alignItems:'center'}}>

                                        <CircularProgressBar percentage={rootTask.getPercentCompleteness()} task={rootTask}/>

                                        <Text style={{color: 'gray', fontSize:10}}>{(rootTask.getPercentCompleteness()*100).toFixed(1)}%</Text>

                                    </View>
                                }
                            
                                <Image source={require('../../../assets/triangle_right.png')} style={{
                                    width:20, height:20, opacity: 0.2, marginHorizontal:5
                                }}/>
                                <Text style={{
                                    color: '#fff',
                                    fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial',
                                    marginHorizontal:5
                                }}>{getNumberOfLeafTasksAfter(rootTask)}</Text>
                            </View>
                        </View>

                    </TouchableHighlight>

                <View style={{width: windowWidth*0.018, height: 2, backgroundColor: rootTask.color, marginTop: 25, marginRight:1, display: !leftBound ? "flex": "none"}}/>
                {/* <View style={{width: 2, height: 195 + index * 60, backgroundColor: rootTask.color, bottom: 168 + index * 60, display: !leftBound ? "flex": "none"}}/> */}

            </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#383838',
      alignItems: 'center',
      borderRadius: 25,
      height: 50
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 20,
        marginHorizontal: 20
    }
  }); 

export default ListItem