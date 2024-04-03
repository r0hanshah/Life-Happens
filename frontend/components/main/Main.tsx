import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, Animated, Button, TouchableHighlight, Image } from 'react-native';
import WireFrame from './wireframe/WireFrame';
import TaskModel from '../../models/TaskModel';
import moment from 'moment';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import RootTaskList from './rootTaskList/RootTaskList';

import MainController from '../../controllers/main/MainController';
import PropertyListener from '../../controllers/main/Listener';

interface Tasks {
    rootTasks: TaskModel[]; // Only root tasks
}

//TODO: Have main do a useEffect to load in the tasks from the backend

var parent = new TaskModel("122", "dp", "122", [], [], "More Test", "yellow", [], [], "2024-03-11T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
var childOfParent = new TaskModel("111", "dp", "122", [], [], "More Test on Parent of Children", "yellow", [parent], [], "2024-03-11T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
childOfParent.children.push(new TaskModel("101", "dp", "122", [], [], "More Test child 1", "yellow", [childOfParent, parent], [], "2024-03-11T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent.children.push(new TaskModel("102", "dp", "122", [], [], "More Test child 2", "yellow", [childOfParent, parent], [], "2024-03-04T19:54:02+0000", "2024-03-05T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent.children.push(new TaskModel("103", "dp", "122", [], [], "More Test child 3", "yellow", [childOfParent, parent], [], "2024-03-07T19:54:02+0000", "2024-03-11T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent.children.push(new TaskModel("104", "dp", "122", [], [], "More Test on child 4", "yellow", [childOfParent, parent], [], "2024-03-19T19:54:02+0000", "2024-03-20T20:54:02+0000", false, {}, "", [], true, "", []))
parent.children.push(childOfParent)

var parent1 = new TaskModel("121", "dp", "121", [], [], "Test Root Task", "red", [], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
var childOfParent1 = new TaskModel("112", "dp", "121", [], [], "Test Root Task", "red", [parent1], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
childOfParent1.children.push(new TaskModel("002", "dp", "121", [], [], "Test Root Task", "red", [childOfParent1, parent1], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent1.children.push(new TaskModel("001", "dp", "121", [], [], "Test Root Task", "red", [childOfParent1, parent1], [], "2024-02-29T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent1.children.push(new TaskModel("003", "dp", "121", [], [], "Test Root Task", "red", [childOfParent1, parent1], [], "2024-03-14T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent1.children.push(new TaskModel("004", "dp", "121", [], [], "Test Root Task", "red", [childOfParent1, parent1], [], "2024-03-14T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
parent1.children.push(childOfParent1)

const Main: React.FC<Tasks> = () => {

  const windowWidth = useWindowDimensions().width;

  const controller = MainController.getInstance();
  var selectedTask = controller.getSelectedTask();
  const [task, setTask] = useState<TaskModel | null>(null);
  const [slideAnimation] = useState(new Animated.Value(0));

  const [rootTasks, setRootTasks] = useState<TaskModel[]>([]);

  // Load in tasks on appear
  useEffect(() => {
    loadRootTasks()
  })

  // Load in tasks
  const loadRootTasks = () =>
  {
    // Load based off the month
    if( currentMonthAndYear == "March 2024")
    {
      setRootTasks(
        [
          parent1, 
          parent,
          new TaskModel("123", "dp", "123", [], [], "One More Test", "green", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          new TaskModel("124", "dp", "124", [], [], "2 Test", "blue", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          new TaskModel("125", "dp", "125", [], [], "3 Test", "orange", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          new TaskModel("126", "dp", "126", [], [], "4 Test", "pink", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          new TaskModel("127", "dp", "127", [], [], "5 Test", "purple", [], [], "2024-03-12T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          new TaskModel("128", "dp", "128", [], [], "6 Test", "red", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          new TaskModel("129", "dp", "129", [], [], "7 Test", "yellow", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          new TaskModel("130", "dp", "130", [], [], "8 Test", "white", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          new TaskModel("131", "dp", "131", [], [], "9 Test", "aqua", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
          ]
      )
    }
    else
    {
      setRootTasks([])
    }
  }

  // Animation
  const slideFromLeft = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-windowWidth*0.49, 0],
  });

  // Update counter state when counterProperty changes
  useEffect(() => {
    const taskListener = controller.getSelectedTask();

    const listener = (task: TaskModel | null) => {
      setTask(task);
    };

    taskListener.addListener(listener)

    return () => {
      taskListener.removeListener(listener);
    };
  }, [controller]);

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
      <View style={{flex: 1, width:'100%'}}>
        {task && (
            <Animated.View
            style={[
              styles.slideInView,
              { transform: [{ translateX: slideFromLeft }], width: windowWidth * 0.49, marginLeft: windowWidth * 0.49 },
            ]}
            >
              {/* Content of the sliding view */}
              <View style={{padding:20}}>
              <TouchableHighlight onPress={() => {setTask(null)}}>
                <Text>X</Text>
              </TouchableHighlight>
                <Text>{task.title}</Text>
              </View>
            </Animated.View>
          )
          }
        <ScrollView style={{width:"100%"}}>
          <View style={[styles.hstack, { marginHorizontal:'9%', paddingTop:80}]}>
            <TouchableHighlight onPress={()=>{setCurrentMonth(currentMonth.subtract(1, 'months'))}}>
              <Image source={require('../../assets/chev_white.png')} style={{width:30, height:20, transform:[{rotate: '90deg'}]}}></Image>
            </TouchableHighlight>
            
            <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:20}}>{currentMonthAndYear}</Text>

            <TouchableHighlight onPress={()=>{setCurrentMonth(currentMonth.add(1, 'months'))}}>
              <Image source={require('../../assets/chev_white.png')} style={{width:30, height:20, transform:[{rotate: '-90deg'}]}}></Image>
            </TouchableHighlight>
          </View>          
          
          <View style={[styles.container, {height: windowHeight * 0.95}]}>
            <WireFrame leafNodesMap={leafNodesMap} sidedRootTasksMap={rootTaskMap} inMoment={currentMonth}/>
          </View>
          <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:'9%', paddingTop:80, paddingBottom: 20}}>Root Tasks</Text>
          <View style={{maxWidth: "auto", alignItems:"center"}}>
            <RootTaskList rootTasksMap={rootTaskMap}/>
          </View>
        </ScrollView>
      </View>
      );
}

const styles = StyleSheet.create({
    slideInView: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 999, // Ensure it's above other content
    },
    container: {
      maxWidth: 'auto',
      backgroundColor: '#151515',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hstack : {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

    }
  });

export default Main