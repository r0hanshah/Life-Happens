import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions, Animated, Button, TouchableHighlight, TouchableOpacity, Image, Modal } from 'react-native';
import WireFrame from './wireframe/WireFrame';
import TaskModel from '../../models/TaskModel';
import moment from 'moment';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';
import RootTaskList from './rootTaskList/RootTaskList';
import TaskView from '../taskView/TaskView';
import ProfileView from '../profileView/ProfileView';

import MainController from '../../controllers/main/MainController';
import PropertyListener from '../../controllers/Listener';
import UserModel from '../../models/UserModel';

import { BlurView } from 'expo-blur';
import DeleteAccount from './deleteAccount/DeleteAccount';

interface Tasks {
    rootTasks: TaskModel[]; // Only root tasks
    signOut: ()=>void;
}

const DEBUG = true

//TODO: Have main do a useEffect to load in the tasks from the backend

var parent = new TaskModel("122", "dp", "122", [], [], "More Test", "#ffc700", [], [], "2024-03-11T19:54:02+0000", "2024-03-30T20:54:02+0000", false, {}, "", [], true, "", [])
var childOfParent = new TaskModel("111", "dp", "122", [], [], "More Test on Parent of Children", "#ffc700", [parent], [], "2024-03-11T19:54:02+0000", "2024-03-30T20:54:02+0000", false, {}, "", [], true, "", [])
childOfParent.children.push(new TaskModel("101", "dp", "122", [], [], "More Test child 1", "#ffc700", [childOfParent, parent], [], "2024-03-11T19:54:02+0000", "2024-03-12T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent.children.push(new TaskModel("102", "dp", "122", [], [], "More Test child 2", "#ffc700", [childOfParent, parent], [], "2024-03-13T19:54:02+0000", "2024-03-18T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent.children.push(new TaskModel("103", "dp", "122", [], [], "More Test child 3", "#ffc700", [childOfParent, parent], [], "2024-03-19T19:54:02+0000", "2024-03-22T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent.children.push(new TaskModel("104", "dp", "122", [], [], "More Test on child 4", "#ffc700", [childOfParent, parent], [], "2024-03-23T19:54:02+0000", "2024-03-30T20:54:02+0000", false, {}, "", [], true, "", []))
parent.children.push(childOfParent)

var parent1 = new TaskModel("121", "dp", "121", [], [], "Test Root Task", "#ff0000", [], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
var childOfParent1 = new TaskModel("112", "dp", "121", [], [], "Test Root Task", "#ff0000", [parent1], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
childOfParent1.children.push(new TaskModel("002", "dp", "121", [], [], "Test Root Task", "#ff0000", [childOfParent1, parent1], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent1.children.push(new TaskModel("001", "dp", "121", [], [], "Test Root Task", "#ff0000", [childOfParent1, parent1], [], "2024-02-29T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent1.children.push(new TaskModel("003", "dp", "121", [], [], "Test Root Task", "#ff0000", [childOfParent1, parent1], [], "2024-03-14T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
childOfParent1.children.push(new TaskModel("004", "dp", "121", [], [], "Test Root Task", "#ff0000", [childOfParent1, parent1], [], "2024-03-14T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
parent1.children.push(childOfParent1)

const Main: React.FC<Tasks> = ({signOut}) => {

  const windowWidth = useWindowDimensions().width;
  const tempUser = new UserModel("guy", "Super Guy", "", "superGuy@ufl.edu")

  const controller = MainController.getInstance();
  var selectedTask = controller.getSelectedTask();

  const [blurVisible, setBlurVisible] = useState(false);

  const [reRender, setReRender] = useState<boolean>(false)

  const [task, setTask] = useState<TaskModel | null>(null);
  const [slideAnimation] = useState(new Animated.Value(0));

  const [rootTasks, setRootTasks] = useState<TaskModel[]>([]);
  const [profileClicked, setProfileClicked] = useState(false);

  const [displayType, setDisplayType] = useState(0);

  // Update display type
  useEffect(()=>{
    const displayListener = controller.getDisplay();

    const listener = (display: number) => {
      setDisplayType(display);
    };

    displayListener.addListener(listener)

    return () => {
      displayListener.removeListener(listener);
    };
  }, [controller])

  // Load in tasks on appear
  useEffect(() => {
    console.log('Number of tasks', controller.getTasks().getValue().length)
    if (DEBUG) {
      controller.setUser(tempUser)
      setRootTasks([])
    }
    else{
      loadRootTasks()
    }
  }, [controller])

  // Load in tasks
  const loadRootTasks = () =>
  {
    const tasks: TaskModel[] = controller.getTasks().getValue()
    setRootTasks(tasks)
    // Load based off the month
    //TODO: Filter out the tasks that match the month and year
  }

  // Animation
  const slideFromLeft = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, windowWidth*0.49],
  });

  // Update tasks array
  useEffect(()=>{
    const taskListener = controller.getTasks();

    const listener = (tasks: TaskModel[]) => {
      setRootTasks(tasks);
    };

    taskListener.addListener(listener)

    return () => {
      taskListener.removeListener(listener);
    };
  }, [controller])

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

  // Rerender the page
  useEffect(() => {
    const renderListener = controller.getReRender();

    const listener = (bool: boolean) => {
      setReRender(bool);
    };

    renderListener.addListener(listener)

    return () => {
      renderListener.removeListener(listener);
    };
  }, [controller]);

  useEffect(() => {
    console.log("Running from rerender")
    const orderedMaps = getAllLeafNodes(rootTasks)
    setLeafNodesMap(orderedMaps[0]);
    setRootTaskMap(orderedMaps[1])
  }, [reRender])

  const windowHeight = useWindowDimensions().height;
  const [leafNodesMap, setLeafNodesMap] = useState<{[key:string]:TaskModel[]}>({});
  const [rootTaskMap, setRootTaskMap] = useState<{[key:string]:TaskModel[]}>({
    "0":[],
    "1":[]
  });

  const [currentMonth, setCurrentMonth] = useState(moment());

  var currentMonthAndYear = currentMonth.format('MMMM YYYY');

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

      for(var rootTask of rootTasks)
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
          rootTask.isLeft = average <= 3
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
      console.log("Running use effect")
      const orderedMaps = getAllLeafNodes(rootTasks)
      setLeafNodesMap(orderedMaps[0]);
      setRootTaskMap(orderedMaps[1])
    }, [rootTasks]);

    const animationRef = useRef(new Animated.Value(task ? 0 : 222)).current;
    const animationProfileRef = useRef(new Animated.Value(profileClicked ? 0 : 222)).current;

    useEffect(() => {
      if (task) {
        Animated.timing(animationRef, {
          toValue: windowWidth * 0.49,
          delay: 100,
          duration: 200,
          useNativeDriver: true
        }).start();
      } else {
        Animated.timing(animationRef, {
          toValue:0,
          duration: 500,
          useNativeDriver: true
        }).start();
      }
    }, [task]);

    useEffect(() => {
      if (profileClicked) {
        Animated.timing(animationProfileRef, {
          toValue: windowWidth * 0.49,
          delay: 100,
          duration: 200,
          useNativeDriver: true
        }).start();
      } else {
        Animated.timing(animationProfileRef, {
          toValue:0,
          duration: 500,
          useNativeDriver: true
        }).start();
      }
    }, [profileClicked]);

    return (
      <View style={{flex: 1, width:'100%'}}>
        
            <Animated.View
              style={[
                styles.slideInView,
                { transform: [{ translateX: slideFromLeft }], width: animationRef },
                task && task.isLeftBound() ? {right: 0} : {left:0}
              ]}
              >
                {/* Content of the sliding view */}
                {task && <TaskView task={task} isLeft={!task.isLeftBound()} onPress={()=>{controller.setSelectedTask(null)}}/>}

            </Animated.View>

            <Animated.View
              style={[
                styles.slideInView,
                { transform: [{ translateX: slideFromLeft }], width: animationProfileRef },
                {left: 0}
              ]}
              >
                {/* Content of the sliding view */}
                {profileClicked && <ProfileView user={controller.getUser().getValue()!} onPress={()=>{setProfileClicked(false)}} signOut={signOut} deletAccount={()=>{setBlurVisible(true)}}/>}

            </Animated.View>

            {blurVisible && (
              <View style={{
                position: 'absolute',
                zIndex: 999,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                justifyContent:'center',
                alignItems:'center'
                }}>

                <BlurView
                  intensity={50}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                  }}
                  tint="dark"
                />
                <DeleteAccount cancel={()=>{setBlurVisible(false)}} user={controller.getUser().getValue()!} deleteAccount={signOut}/>

              </View>
              
            )}
          
        <ScrollView style={{width:"100%", paddingBottom:80}}>
          <View style={[styles.hstack, { marginHorizontal:'9%', paddingTop: 80, justifyContent:'space-between', zIndex:99}]}>
            <View style={styles.hstack}>

              {displayType != 0 ? 
              <TouchableOpacity style={{ backgroundColor:'#303030', width:50, height:50, borderRadius:40, justifyContent:'center', alignItems:'center', marginRight:10}} onPress={()=>{
                controller.setDisplay(0)
                }}>
                <Image source={require('../../assets/calendar_icon.png')} style={{
                  width:30, height:30, opacity: 0.5
                }}/>
              </TouchableOpacity>
              : <View style={{display:'none'}}/>}

              <TouchableOpacity onPress={()=>{setCurrentMonth(moment(currentMonth).subtract(1, 'months')); console.log(currentMonth)}}>
                <Image source={require('../../assets/chev_white.png')} style={{width:30, height:20, transform:[{rotate: '90deg'}]}}></Image>
              </TouchableOpacity>
              
              <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:20}}>{currentMonth.format('MMMM YYYY')}</Text>

              <TouchableOpacity onPress={()=>{setCurrentMonth(moment(currentMonth).add(1, 'months')); console.log(currentMonth)}}>
                <Image source={require('../../assets/chev_white.png')} style={{width:30, height:20, transform:[{rotate: '-90deg'}]}}></Image>
              </TouchableOpacity>
            </View>
            

            <TouchableOpacity style={{justifyContent:'center', alignItems:'center', height: 80, width: 80, backgroundColor:'orange', borderRadius:50}}
            onPress={()=>{// Display user data
              setProfileClicked(profileClicked ? false :true)
              controller.setSelectedTask(null)
            }}
            >
              <Text style={{color:'white', fontSize:40}}>{controller.getUser().getValue()?.name.at(0)}</Text>
            </TouchableOpacity>
          </View>          
          
          {/* Calendar */}
          <View style={[styles.container, {marginTop:20}]}>
            <WireFrame leafNodesMap={leafNodesMap} sidedRootTasksMap={rootTaskMap} inMoment={currentMonth}/>
          </View>

          {/* Root task list */}
          <View>
            <View style={{justifyContent:'space-between', flexDirection:'row', alignItems:'flex-end'}}>
              <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:'9%', paddingTop:80, paddingBottom: 20}}>Root Tasks</Text>

              <TouchableOpacity style={{width:80, height:80, borderRadius:100, backgroundColor:'rgba(30,30,30,1)', alignItems:'center', justifyContent:'center', marginHorizontal:'9%', marginBottom:20}}
              onPress={() => {
                if(controller.getSelectedTask().getValue() === null)
                  controller.createNewTask()
              }}
              >
                <Image source={require('../../assets/x_mark_white.png')} style={{width:15, height:15, transform:[{rotate: '-45deg'}], opacity: controller.getSelectedTask().getValue() === null ? 1 : 0.2 }}></Image>
              </TouchableOpacity>
            </View>
            
            <View style={{maxWidth: "auto", alignItems:"center"}}>
              <RootTaskList rootTasksMap={rootTaskMap} inMoment={currentMonth}/>
            </View>
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