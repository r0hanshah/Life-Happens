import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import TaskModel from '../../../models/TaskModel';
import ListItem from './ListItem';

interface RootTaskListProps
{
    rootTasksMap: {[key:string]:TaskModel[]}
}

const RootTaskList: React.FC<RootTaskListProps> = ({ rootTasksMap }) => 
{

    const renderLists = (rootTasksMap: {[key:string]:TaskModel[]}) => {

        const windowWidth = useWindowDimensions().width;

        const leftBoundTasks = []
        const rightBoundTasks = []

        // Left Bound Tasks
        console.log(rootTasksMap)
        for(const task of rootTasksMap["1"])
        {
            leftBoundTasks.push(<ListItem rootTask={task} leftBound={true}/>)
        }

        // Right Bound Tasks
        for(const task of rootTasksMap["0"])
        {
            rightBoundTasks.push(<ListItem rootTask={task} leftBound={false}/>)
        }

        const lists = [
            <View style={{width: windowWidth * 0.40, marginRight: windowWidth*0.04}}>
                {leftBoundTasks}
            </View>,
            <View style={{width: windowWidth * 0.40}}>
                {rightBoundTasks}
            </View>
        ]
    
        return lists;
      };

    return (
        <View style={styles.container}>
            {renderLists(rootTasksMap)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: "center"
    },
  }); 

export default RootTaskList