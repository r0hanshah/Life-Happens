import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import TaskModel from '../../../models/TaskModel';
import ListItem from './ListItem';
import moment from 'moment';
import MainController from '../../../controllers/main/MainController';

interface RootTaskListProps
{
    rootTasksMap: {[key:string]:TaskModel[]}
    inMoment: moment.Moment;
}

const RootTaskList: React.FC<RootTaskListProps> = ({ rootTasksMap, inMoment }) => 
{
    const controller = MainController.getInstance()

    const windowWidth = useWindowDimensions().width;
    const firstDayOfMonth = inMoment.clone().startOf('month');
    let startDay = firstDayOfMonth.clone().startOf('week');
    let endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

    let display = controller.getDisplay().getValue();

    function findLeafNodeWithinDates(
        node: TaskModel,
        rangeStart: Date,
        rangeEnd: Date
      ): boolean {
        // Helper function to check if a date is within the range
        const isWithinRange = (date: Date, start: Date, end: Date): boolean => {
          return date >= start && date <= end;
        };
      
        // DFS function to traverse the tree
        function dfs(node: TaskModel): boolean {
          // If the node has no children, it's a leaf node
          if (!node.children || node.children.length === 0) {
            return (
              isWithinRange(node.startDate, rangeStart, rangeEnd) ||
              isWithinRange(node.endDate, rangeStart, rangeEnd)
            );
          }
      
          // Continue DFS through the children
          for (let child of node.children) {
            if (dfs(child)) {
              return true;
            }
          }
      
          return false;
        }
      
        // Start DFS from the root node
        return dfs(node);
      }

    const renderLists = (rootTasksMap: {[key:string]:TaskModel[]}) => {

        const leftBoundTasks = []
        const rightBoundTasks = []

        if (display == 1)
        {
            startDay = inMoment.clone().startOf('week')
            endDay = inMoment.clone().endOf('week')
        }
        else if (display == 2)
        {
            startDay = inMoment.clone().startOf('day')
            endDay = inMoment.clone().endOf('day')
            console.log(startDay, endDay)
        }

        // Left Bound Tasks
        var count = 0
        for(const task of rootTasksMap["1"])
        {
            console.log("Task: ",task.title, task.endDate, task.startDate)
            const momentEndDate = moment(task.endDate)
            if (findLeafNodeWithinDates(task,startDay.toDate(),endDay.toDate()))
            {
                leftBoundTasks.push(<ListItem key={task.id} rootTask={task} leftBound={true} index={count}/>)
                task.rootIndex = count;
                count += 1;
            }

        }

        // Right Bound Tasks
        count = 0
        for(const task of rootTasksMap["0"])
        {
            const momentEndDate = moment(task.endDate)
            if (findLeafNodeWithinDates(task,startDay.toDate(),endDay.toDate()))
            {
                display == 2 ? leftBoundTasks.push(<ListItem key={task.id} rootTask={task} leftBound={false} index={count}/>) : rightBoundTasks.push(<ListItem key={task.id} rootTask={task} leftBound={false} index={count}/>)

                task.rootIndex = count;
                count += 1;
            }
        }

        const lists = display == 2 ? [
            <View key={"leftList"} style={{flex: 1, alignItems: "flex-start"}}>
                {leftBoundTasks}
            </View>
        ] : [
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
        <View style={[styles.container, {width: windowWidth * 0.83 + 14}, display == 2 ? {marginLeft: 50} : {}]}>
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