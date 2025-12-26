import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions, Text, Image, TouchableOpacity, TextInput, Alert, Button, ScrollView, FlatList, Platform, Linking, ActivityIndicator } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

import TaskModel from '../../models/TaskModel';
import TaskViewController from '../../controllers/taskView/TaskViewController';
import MainController from '../../controllers/main/MainController';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import CircularProgressBar from './CircularProgressView';

import DateSelector from './DateSelector';
import TimeSelector from './TimeSelector';

import CreateSubTaskView from './CreateSubTaskView';
import ColorSelector from './ColorSelector';
import Canvas from './treeView/Canvas';
import TaskHeader from './TaskHeader';
import TaskMetaData from './TaskMetaData';
import NotesSection from './NotesSection';
import ExtraMediaSection from './ExtraMediaSection';
import UnobservedFilesSection from './UnobservedFilesSection';
import AIContextSection from './AIContextSection';
import AIObservedFilesSection from './AIObservedFilesSection';
import SubtaskSection from './SubtaskSection';
import TaskControlSection from './TaskControlSection';


interface TaskViewProps {
  task: TaskModel;
  isLeft: Boolean;
  onPress: () => void;
}

const TaskView: React.FC<TaskViewProps> = ({ task, isLeft, onPress }) => {

  const controllerRef = useRef(new TaskViewController(task));
  const controller = controllerRef.current;
  const mainController = MainController.getInstance();
  const [isMovable, setIsMovable] = useState(task.isMovable)
  const [generating, setGenerating] = useState(false)

  const [viewTree, setViewTree] = useState(false);

  const [startNotify, setStartNotify] = useState(task.startNotify)
  const [endNotify, setEndNotify] = useState(task.endNotify)

  useEffect(()=>{setStartNotify(task.startNotify); setEndNotify(task.endNotify)},[task])

  let windowHeight = useWindowDimensions().height;
  let windowWidth = useWindowDimensions().width;

  let [fontsLoaded] = useFonts({
    Inter_900Black
  });

    // Get current user from mainController
  const currentUser = mainController.getUser().getValue();
  const inviterId = currentUser ? currentUser.id : null; // Adjust this based on how the user ID is stored
  
    // Ensure inviterId is available
    if (!inviterId) {
        console.error("Inviter ID is not available");
        return null;
    }

  // For AI Context Prompt section
  const [context, setContext] = useState(task.contextText);

  // For adding unobserved files
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>(task.unobservedFiles);

  // For adding AI observed files
  const [observedFiles, setObservedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>(task.contextFiles);

  // For Creating subtask
  const [newTasks, setNewTasks] = useState<TaskModel[]>([]);


  // For Delete task
  const [deleteTaskClicked, setDeleteTaskClicked] = useState(false)
  const [validDeleteInput, setValidDeleteInput] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")

  const validateDelete = () => {
    setValidDeleteInput(deleteInput == task.title)
  }

  useEffect(() => {
    validateDelete()
  }, [deleteInput])

  // Re render task view here
  const [rerender, setRerender] = useState(false)

  useEffect(()=>{
    console.log("Rerendering")
  },[rerender])

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    if (scrollViewRef.current)
        scrollViewRef.current.scrollToEnd({ animated: true });
  };

  useEffect(() => {if(deleteTaskClicked) {scrollToBottom()}}, [deleteTaskClicked])

  const calculateDuration = (startDate:Date, endDate:Date) => {
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }
  };

  // For date pickers
    const [duration, setDuration] = useState(calculateDuration(task.startDate, task.endDate));
    const [durationFromNow, setDurationFromNow] = useState(calculateDuration(new Date(), task.endDate));

  // For changes in task
  useEffect(()=>{
    setFiles(task.unobservedFiles)
    setObservedFiles(task.contextFiles)
    setContext(task.contextText)
  }, [task])


  return(
    <View style={{minHeight:'100%'}}>
        <View style={isLeft ? styles.gradientOverlayL : styles.gradientOverlayR}>
            <LinearGradient
            colors={[task.color, darkenColor(task.color, 0.9)]}              
            style={styles.gradient}/>
        </View>
        <View style={[styles.container, isLeft ? styles.containerL : styles.containerR]}>

            <ScrollView ref={scrollViewRef} style={{ height: useWindowDimensions().height, padding:39}}>
                <View style ={{flexDirection: isLeft ? 'row' : 'row-reverse', width:'100%', paddingBottom: 20, paddingTop:20 }}>

                    {/* Circle with wire extending from it */}
                    <View style={{width: '15%', alignItems:'center', zIndex:5}}>
                        <ColorSelector task={task} isLeft={isLeft} updateFunctions={[]}/>
                        {(task.children.length > 0 || newTasks.length > 0)  && <View style={{width:2, height: task.children.length > 0 ? '72.65%' : '70%', backgroundColor: task.color, zIndex:-1}}></View>}
                    </View>

                    {/* Content */}
                    <View style={{width:'80%', alignItems: isLeft ? 'flex-start' : 'flex-end'}}>

                        <TaskHeader task={task} currentUser={currentUser!} isLeft={isLeft}/>

                        <TaskMetaData task={task} isLeft={isLeft} taskViewController={controller} mainController={mainController}/>

                        <NotesSection task={task} isLeft={isLeft} fontsLoaded={fontsLoaded} taskViewController={controller} mainController={mainController}/>

                        <ExtraMediaSection task={task} isLeft={isLeft} fontsLoaded={fontsLoaded} mainController={mainController}/>

                        <UnobservedFilesSection task={task} isLeft={isLeft} fontsLoaded={fontsLoaded} mainController={mainController}/>

                        {/*AI */}
                        <Text style={[{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:40}, {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>AI</Text>

                        <AIContextSection task={task} isLeft={isLeft} fontsLoaded={fontsLoaded} mainController={mainController}/>

                        <AIObservedFilesSection task={task} isLeft={isLeft} fontsLoaded={fontsLoaded} mainController={mainController}/>

                        {/* Subtasks */}
                        <SubtaskSection task={task} isLeft={isLeft} fontsLoaded={fontsLoaded} taskViewController={controller} mainController={mainController}/>

                        <TaskControlSection task={task} newTasks={newTasks} isLeft={isLeft} fontsLoaded={fontsLoaded} taskViewController={controller} mainController={mainController}/>
                    </View>
                </View>

            </ScrollView>

            {viewTree &&
            <View  style={[{height: windowHeight, position:'absolute', top:0, width:windowWidth*0.515, backgroundColor:'#050505'}, isLeft ? {left:windowWidth*0.475} : {right:windowWidth*0.485}]}>
                <View style={[styles.container, {justifyContent:'center', alignItems:'center'}, isLeft ? styles.containerL : styles.containerR, {overflow:'hidden'}]}>
                    <Canvas rootTask={task.ancestors.length > 0 ? task.ancestors[task.ancestors.length-1] : task} currentTask={task}/>
                </View>
                <View style={isLeft ? styles.gradientOverlayL : styles.gradientOverlayR}>
                    <LinearGradient
                    colors={[task.color, darkenColor(task.color, 0.9)]}              
                    style={styles.gradient}/>
                </View>
            </View>
            }
            
            {/* X and other page manipulation components */}
            <View style={[{width: '5%', minHeight:'100%', alignItems:'center', position:'absolute', top:20}, isLeft ? {right:20 - (viewTree ? windowWidth*0.51 : 0)} : {left:20 - (viewTree ? windowWidth*0.52 : 0)}]}>
                    <TouchableOpacity onPress={onPress}>
                        <Image source={require('../../assets/x_mark_white.png')} style={{width:20, height:20}}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity style={{position:'absolute', top:useWindowDimensions().height*0.49}} onPress={()=>{setViewTree(!viewTree)}}>
                        <Image source={require('../../assets/chev_white.png')} style={{width:30, height:20, transform:[{rotate: viewTree ? isLeft ? '90deg' : '-90deg' : isLeft ? '-90deg' : '90deg'}]}}/>
                    </TouchableOpacity>
            </View>
            
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    gradientOverlayL: {
        ...StyleSheet.absoluteFillObject,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        overflow: 'hidden',
    },
    gradientOverlayR: {
        ...StyleSheet.absoluteFillObject,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
    },
    container: {
        backgroundColor: "#151515",
        zIndex: 1, 
        minWidth: '95%',
        minHeight: '100%'
    },
    containerL: {
        flexDirection: 'row',
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        marginRight: 3
    },
    containerR: {
        flexDirection: 'row-reverse',
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        marginLeft: 3
    }
  });

  function darkenColor(color:String, factor:Double) {
    // Convert hex color to RGB
    let hex = color.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
  
    // Darken each RGB component
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));
  
    // Ensure values are within range
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
  
    // Convert RGB back to hex
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

export default TaskView;