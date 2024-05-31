import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import TaskModel from '../../../models/TaskModel';
import ListItem from './ListItem';
import moment from 'moment';

interface RootTaskListProps
{
    rootTasksMap: {[key:string]:TaskModel[]}
    inMoment: moment.Moment;
}

const RootTaskList: React.FC<RootTaskListProps> = ({ rootTasksMap, inMoment }) => 
{

    const windowWidth = useWindowDimensions().width;
    const firstDayOfMonth = inMoment.clone().startOf('month');
    const startDay = firstDayOfMonth.clone().startOf('week');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

    const renderLists = (rootTasksMap: {[key:string]:TaskModel[]}) => {

        const leftBoundTasks = []
        const rightBoundTasks = []

        // Left Bound Tasks
        var count = 0
        for(const task of rootTasksMap["1"])
        {
            const momentEndDate = moment(task.endDate)
            if (momentEndDate.isBetween(startDay,endDay))
            {
                leftBoundTasks.push(<ListItem key={task.id} rootTask={task} leftBound={true} index={count}/>)
                count += 1;
            }
        }

        // Right Bound Tasks
        count = 0
        for(const task of rootTasksMap["0"])
        {
            const momentEndDate = moment(task.endDate)
            if (momentEndDate.isBefore(endDay) && momentEndDate.isAfter(firstDayOfMonth))
            {
                rightBoundTasks.push(<ListItem key={task.id} rootTask={task} leftBound={false} index={count}/>)
                count += 1;
            }
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
        <View style={[styles.container, {width: windowWidth * 0.83 + 14}]}>
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