import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import WireFrame from './wireframe/WireFrame';
import TaskModel from '../../models/TaskModel';
import moment from 'moment';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import RootTaskList from './rootTaskList/RootTaskList';

interface Tasks {
    rootTasks: TaskModel[]; // Only root tasks
}

const Main: React.FC<Tasks> = ({ rootTasks }) => {

    const windowHeight = useWindowDimensions().height;
    const [leafNodesMap, setLeafNodesMap] = useState<{[key:string]:TaskModel[]}>({});
    const [rootTaskMap, setRootTaskMap] = useState<{[key:string]:TaskModel[]}>({
      "0":[],
      "1":[]
    });

    const [currentMonth, setCurrentMonth] = useState(moment());

    const currentMonthAndYear = currentMonth.format('MMMM YYYY');

    let [fontsLoaded] = useFonts({
        Inter_900Black
      });
    
    // Extract leaf nodes from root tasks with breadth first search
    const getAllLeafNodes=(rootTasks:TaskModel[]):[{ [key: string]: TaskModel[]}, { [key: string]: TaskModel[]}] =>
    {
      var allLeafNodes:{[key:string]:TaskModel[]} = {}
      var sidedRootTasks:{ [key: string]: TaskModel[]} = {
        "0":[],
        "1":[]
      }

      for(const rootTask of rootTasks)
      {
        const leafNodes:TaskModel[] = bfsTree(rootTask)

        const key = (leafNodes:TaskModel[], parentId:string): string =>
        {
          var sum:number = 0
          var count:number = 0
          for(const node of leafNodes)
          {
            sum += node.startDate.getDay()
            count += 1
          }
          const average = sum / count
          sidedRootTasks[average > 3 ? "0":"1"].push(rootTask)
          return parentId + ":::" + (average > 3 ? "0":"1")
        }

        allLeafNodes[key(leafNodes, rootTask.id)] = leafNodes
      }

      return [allLeafNodes, sidedRootTasks]
    }

    const bfsTree=(root:TaskModel):TaskModel[] =>
    {
      var q:TaskModel[] = []
      var leafNodes:TaskModel[] = []

      q.push(root)

      while(q.length != 0)
      {
        var observedNode:TaskModel = q[0]
        if(observedNode.children.length == 0)
        {
          leafNodes.push(observedNode)
        }
        else
        {
          for(const child of observedNode.children)
          {
            q.push(child)
          }
        }
        q.shift()
      }

      return leafNodes
    }

    // Set all leaf nodes
    useEffect(() => {
      const orderedMaps = getAllLeafNodes(rootTasks)
      setLeafNodesMap(orderedMaps[0]);
      setRootTaskMap(orderedMaps[1])
    }, [rootTasks]);


    return (
        <ScrollView style={{width:"100%"}}>
          <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:'9%', paddingTop:80}}>{currentMonthAndYear}</Text>
          <View style={[styles.container, {height: windowHeight * 0.95}]}>
            <WireFrame leafNodesMap={leafNodesMap} sidedRootTasksMap={rootTaskMap} inMoment={currentMonth}/>
          </View>
          <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:'9%', paddingTop:80, paddingBottom: 20}}>Root Tasks</Text>
          <View style={{maxWidth: "auto", alignItems:"center"}}>
            <RootTaskList rootTasksMap={rootTaskMap}/>
          </View>
        </ScrollView>
      );
}

const styles = StyleSheet.create({
    container: {
      maxWidth: 'auto',
      backgroundColor: '#151515',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Main