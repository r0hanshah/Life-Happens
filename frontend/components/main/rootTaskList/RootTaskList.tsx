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

    const windowWidth = useWindowDimensions().width;

    const renderLists = (rootTasksMap: {[key:string]:TaskModel[]}) => {

        const leftBoundTasks = []
        const rightBoundTasks = []

        // Left Bound Tasks
        console.log(rootTasksMap)
        var count = 0
        for(const task of rootTasksMap["1"])
        {
            leftBoundTasks.push(<ListItem key={task.id} rootTask={task} leftBound={true} index={count}/>)
            count += 1;
        }

        // Right Bound Tasks
        count = 0
        for(const task of rootTasksMap["0"])
        {
            rightBoundTasks.push(<ListItem key={task.id} rootTask={task} leftBound={false} index={count}/>)
            count += 1;
        }

        const lists = [
            <View key={"leftList"} style={{flex: 1, alignItems: "flex-start"}}>
                {leftBoundTasks}
            </View>,
            <View key={"rightList"} style={{flex: 1, alignItems: "flex-end"}}>
                {rightBoundTasks}
            </View>
        ]
    
        return lists;
      };

    return (
        <View style={[styles.container, {width: windowWidth * 0.83 + 15}]}>
            {renderLists(rootTasksMap)}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      width: "100%",
      alignItems: 'flex-start',
      justifyContent: "center",
      flexDirection: "row"
    },
  }); 

export default RootTaskList