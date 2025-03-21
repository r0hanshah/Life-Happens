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
import InviteUser from './InviteUser';
import Canvas from './treeView/Canvas';


interface TaskViewProps {
  task: TaskModel;
  isLeft: Boolean;
  onPress: () => void;
}

const TaskView: React.FC<TaskViewProps> = ({ task, isLeft, onPress }) => {

  const controller = new TaskViewController(task);
  const mainController = MainController.getInstance();
  const [viewUsers, setViewUsers] = useState(false)
  const [isMovable, setIsMovable] = useState(task.isMovable)
  const [generating, setGenerating] = useState(false)

  const [viewTree, setViewTree] = useState(false);

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

  useEffect(()=>{
    const taskListener = mainController.getLoadingGenerateTasks();

    const listener = (bool: boolean) => {
      setGenerating(bool);
    };

    taskListener.addListener(listener)

    return () => {
      taskListener.removeListener(listener);
    };
  }, [mainController])

  // For subtask interaction
  const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null)

  // For progress circle
  const [completion, setCompletion] = useState(task.getPercentCompleteness())
  
  useEffect(() => {
    const taskListener = controller.getViewInvitedUsers();
    setCompletion(task.getPercentCompleteness())

    const listener = (bool: boolean) => {
      setViewUsers(bool);
    };

    taskListener.addListener(listener)
    setIsMovable(task.isMovable)

    return () => {
      taskListener.removeListener(listener);
    };
  }, [controller]);

  // For URL validation and display
  const [urlText, setUrlText] = useState('');
  const [urls, setUrls] = useState<string[]>(task.extraMedia);

  const [urlsMetadata, setUrlsMetadata] = useState<{ title: string; description: string; image: string; url:string}[] | null>([]);

  const handleAddItem = () => {
    if (isValidUrl(urlText)) {
      setUrls([...urls, urlText]);
      task.extraMedia = [...urls, urlText]
      setUrlText('');
      mainController.saveEditToTask(task)
    } else {
      alert('Invalid URL');
    }
  };

  const handleDeleteMedia = (urlToDelete:string) => {
    const filteredUrls = urls.filter(url => url !== urlToDelete)
    setUrls(urls.filter(url => url !== urlToDelete))
    task.extraMedia = filteredUrls
    if (urlsMetadata)
    {
        setUrlsMetadata(urlsMetadata!.filter(data => data.url !== urlToDelete))
    }
    mainController.saveEditToTask(task)
  }

  const fetchMetadata = async (url:string) => {
    try {
      const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  };

  const isValidUrl = (url:string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    // Fetch metadata for each URL when the component mounts
    const fetchUrlsMetadata = async () => {
        const urlsMetadata = await Promise.all(urls.map(fetchMetadata));
        console.log('URLs metadata:', urlsMetadata);
        // Extract features from metadata and update state
        if(urlsMetadata == null)
        {
            setUrlsMetadata(null)
            return
        }
        console.log(urlsMetadata[0])
        const extractedData = urlsMetadata.map(metadata => (
        {
          title: metadata.data.title,
          description: metadata.data.description,
          image: metadata.data.logo.url, 
          url: metadata.data.url
        }));
        setUrlsMetadata(extractedData);
    };
    fetchUrlsMetadata();
  }, [urls]);


  // For Notes section
  const [text, setText] = useState(task.notes);

  const onChangeText = (newText: React.SetStateAction<string>) => {
    setText(newText);
    task.notes = newText.valueOf().toString()
    mainController.saveEditToTask(task)
  };

  const onSubmitEditing = () => {
    // Handle submission logic here
    console.log('Submitted text:', text);
  };

  // For AI Context Prompt section
  const [context, setContext] = useState(task.contextText);

  const onChangeContext = (newText: React.SetStateAction<string>) => {
    setContext(newText);
    task.contextText = newText.valueOf().toString()
    mainController.saveEditToTask(task)
  };

  const onSubmitContextEditing = () => {
    // Handle submission logic here
    console.log('Submitted text:', text);
  };

  // For adding unobserved files
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>(task.unobservedFiles);

  // Function to handle file selection
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (result && result.assets) {
        const doc = result.assets.at(0)!
        const file = {
            name: doc.name,
            size: doc.size,
            type: doc.mimeType!,
            uri: doc.uri,
        }
        // Add the selected file to the files array
        setFiles([...files, result.assets.at(0)!]);
        task.unobservedFiles = [...files, result.assets.at(0)!]
        mainController.saveEditToTask(task)
        mainController.uploadFileToTask(task, file)
      }
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

  const handleRemoveFile = (doc:DocumentPicker.DocumentPickerAsset) => {
    const newFiles = files.filter(document => document.uri !== doc.uri)
    task.unobservedFiles = newFiles
    mainController.saveEditToTask(task)
    setFiles(newFiles)
    mainController.deleteFileFromTask(task, doc.name)
  }

  // For adding AI observed files
  const [observedFiles, setObservedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>(task.contextFiles);

  // Function to handle file selection
  const handleObservedFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (result && result.assets) {

        const doc = result.assets.at(0)!
        const file = {
            name: doc.name,
            size: doc.size,
            type: doc.mimeType!,
            uri: doc.uri,
        }

        // Add the selected file to the files array
        setObservedFiles([...observedFiles, result.assets.at(0)!]);
        task.contextFiles = [...observedFiles, result.assets.at(0)!]
        mainController.saveEditToTask(task)
        mainController.uploadFileToTask(task, file)
      }
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

  const handleRemoveContextFile = (doc:DocumentPicker.DocumentPickerAsset) => {
    const newFiles = observedFiles.filter(document => document.uri !== doc.uri)
    task.contextFiles = newFiles
    mainController.saveEditToTask(task)
    setObservedFiles(newFiles)
    mainController.deleteFileFromTask(task, doc.name)
  }

  // For Creating subtask
  const [newTasks, setNewTasks] = useState<TaskModel[]>([]);

  const handleDeleteNewTask = (taskToDelete:TaskModel) => {
    setNewTasks(newTasks.filter(task => task.id !== taskToDelete.id))
  }

  // For Delete task
  const [deleteTaskClicked, setDeleteTaskClicked] = useState(false)
  const [validDeleteInput, setValidDeleteInput] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")

  const handleDeleteTask = () => {
    // If task is root, then remove it from root task list in main controller
    const mainController = MainController.getInstance()
    mainController.deleteTaskOnFirestore(task)
    if(task.isRoot)
    {
        mainController.deleteRootTask(task);
        return
    }
    else
    {
        // otherwise, go to the parent, and remove the child and set the selected task in main to null
        const parent = task.ancestors[0]
        parent.children = parent.children.filter(inTask => inTask.id !== task.id);
        mainController.setSelectedTask(null)
    }
    
  }

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
  

  // Render subtasks
  const renderSubtasks = () => {
    if( task.children.length > 0)
    {
        return (


                <View style={{alignItems: isLeft? 'flex-start' : 'flex-end', marginTop:20}}>

                    {task.children.map((task, index) => (
                        <TouchableOpacity key={index} style={{ width:'95%', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:30, alignItems: selectedTask && selectedTask.id == task.id ? 'flex-start' : 'center', marginVertical: 10, zIndex:-index}} onPress={()=>{
                            if (selectedTask && selectedTask.id == task.id)
                            {
                                MainController.getInstance().setSelectedTask(selectedTask)
                            }
                            else
                            {
                                setSelectedTask(task)
                            }
                            
                            }}>
                                <View style={{flexDirection:isLeft? 'row' : 'row-reverse', justifyContent:'space-between', alignItems:'center', width:'100%', height:50}}>
                                    <View style={{flexDirection:isLeft? 'row' : 'row-reverse', alignItems:'center'}}>
                                        <View style={{backgroundColor:task.color, width: 20, height:20, borderRadius:20, margin:10}}/>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{color:'white', width: 200, overflow:'hidden'}}>{task.title}</Text>
                                    </View>
                                    <Text style={{color:'white'}}>{task.children.length == 0 ? 'Leaf Task' : task.children.length +' Sub Tasks'}</Text>
                                    <View style={{flexDirection: 'row', marginHorizontal: 20, padding: 10, alignItems:'center'}}>

                                            <CircularProgressBar percentage={task.getPercentCompleteness()} task={task}/>

                                            <Text style={{color: 'gray'}}>{(task.getPercentCompleteness()*100).toFixed(1)}%</Text>

                                    </View>
                                    <View style={[{height:2, width: 50, position:'absolute', backgroundColor:task.color}, isLeft?{ marginLeft:-50} : { marginRight:-50}]}></View>
                                    <View style={[{height:420, width: 1.5, position:'absolute', backgroundColor:task.color, marginTop:-418}, isLeft ? {marginLeft:-50.0} : {marginRight:-50.0}]}></View>
                                </View>

                                {(selectedTask && selectedTask.id == task.id) && 
                                <View style={[{width:'100%', zIndex:4, paddingHorizontal:25, paddingBottom:20}]}>
                                    <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:20, zIndex:4}}>
                                        <View style={{flexDirection:'row'}}>
                                            <Image
                                                style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                                source={require('../../assets/calendar_icon.png')}
                                                resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                            />
                                            <Text style={{color:'gray'}}>Start Date</Text>
                                        </View>
                                        <View style={{flexDirection:'row'}}>
                                            <DateSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></DateSelector>
                                            <TimeSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></TimeSelector>
                                        </View>
                                        
                                        {/* <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text> */}
                                    </View>
                                    
                                    <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10, zIndex:3}}>
                                        <View style={{flexDirection:'row'}}>
                                        <Image
                                            style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                            source={require('../../assets/calendar_icon.png')}
                                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                        />
                                        <Text style={{color:'gray'}}>End Date</Text>
                                        </View>
                                        <View style={{flexDirection:'row'}}>
                                            <DateSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></DateSelector>
                                            <TimeSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></TimeSelector>
                                        </View>
                                        {/* <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text> */}
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                        <View style={{flexDirection:'row'}}>
                                        <Image
                                            style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                            source={require('../../assets/clock_icon.png')}
                                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                        />
                                        <Text style={{color:'gray'}}>Duration</Text>
                                        </View>
                                        <Text style={{color:'gray'}}>{duration}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                        <View style={{flexDirection:'row'}}>
                                        <Image
                                            style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                            source={require('../../assets/clock_icon.png')}
                                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                        />
                                        <Text style={{color:'gray'}}>Duration From Now</Text>
                                        </View>
                                        <Text style={{color:'gray'}}>{durationFromNow}</Text>
                                    </View>
                                    { task.children.length == 0 &&
                                    <View>
                                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                            <View style={{flexDirection:'row'}}>
                                            <Image
                                                style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                                source={require('../../assets/robot_icon.png')}
                                                resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                            />
                                            <Text style={{color:'gray'}}>Is Movable?</Text>
                                            </View>
                                            <TouchableOpacity onPress={()=>{task.isMovable = task.isMovable ? false : true; setIsMovable(task.isMovable);mainController.saveEditToTask(task)}}>
                                                <Text style={{color:'gray'}}>{isMovable ? 'Yes' : 'No'}</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:40, width:"100%", borderRadius:10, backgroundColor:'#86C28B', margin:10, marginTop:20}} onPress={()=>{
                                            task.completeness = 1
                                            console.log("clicked", rerender)
                                            setRerender(rerender? false : true)
                                        }}>
                                            <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>Mark as Complete</Text>
                                            <Image
                                                style={{width: 20, height: 20, marginHorizontal: 10}}
                                                source={require('../../assets/check_mark_icon.png')}
                                                resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                            />
                                        </TouchableOpacity>

                                    </View>
                                    }
                                    
                                </View>
                                }
                                
                            
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'rgba(50, 50, 50, 1)', margin:10, marginTop:40, zIndex:-999}} onPress={async ()=>{
                        if (!generating)
                        {
                            const generatedTasks = await MainController.getInstance().handleGenerateTasks(task)
                            setNewTasks(newTasks.concat(generatedTasks))
                        }
                    }}>

                    <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>{generating ? "Generating Sub Tasks...": "Generate Sub Tasks"}</Text>
                    {generating && 
                        <ActivityIndicator size="small" color="#ffffff" style={{width: 20, height: 20, marginHorizontal: 10}}/>
                    }
                    {!generating &&
                        <Image
                            style={{width: 20, height: 20, marginHorizontal: 10}}
                            source={require('../../assets/robot_icon.png')}
                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                        />
                    }

                    </TouchableOpacity>

                </View>
                

        )
    }
    else
    {
        return (

    
            <View style={{alignItems: isLeft ? 'flex-start': 'flex-end'}}>
                <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'#86C28B', margin:10}} onPress={()=>{
                    setCompletion(1)
                    task.completeness = 1
                    }}>

                    <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>Mark as Complete</Text>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10}}
                        source={require('../../assets/check_mark_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />

                </TouchableOpacity>

                <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'rgba(50, 50, 50, 1)', margin:10}} 
                onPress={async ()=>{
                    if(!generating)
                    {
                        const generatedTasks = await MainController.getInstance().handleGenerateTasks(task)
                        setNewTasks(newTasks.concat(generatedTasks))
                    }
                    }}>

                <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>{generating ? "Generating Sub Tasks...": "Generate Sub Tasks"}</Text>
                    {generating && 
                        <ActivityIndicator size="small" color="#ffffff" style={{width: 20, height: 20, marginHorizontal: 10}}/>
                    }
                    {!generating &&
                        <Image
                            style={{width: 20, height: 20, marginHorizontal: 10}}
                            source={require('../../assets/robot_icon.png')}
                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                        />
                    }

                </TouchableOpacity>
            </View>

        )
    }
    
  }

  // Render ancestors
  const renderAncestors = () => {
    if( task.ancestors.length > 0)
    {
        console.log(task.ancestors.length)
        return (
            <View style={{width:'100%'}}>
                <View style={{alignItems: isLeft? 'flex-start' : 'flex-end', marginTop:20, flexDirection:'row-reverse'}}>

                    {task.ancestors.toReversed().map((task, index) => (
                        <TouchableOpacity style={{flexDirection:isLeft? 'row' : 'row-reverse', justifyContent:'space-between', height:50, width:220, backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:5, alignItems:'center', margin: 10}} onPress={()=>{MainController.getInstance().setSelectedTask(task)}}>
                            
                                <View style={{flexDirection:isLeft? 'row' : 'row-reverse', alignItems:'center'}}>
                                    <View style={{backgroundColor:task.color, width: 20, height:20, borderRadius:20, margin:10}}/>
                                    <View style={{alignItems:isLeft?'flex-start':'flex-end'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', width:160, textAlign:isLeft? 'left' : 'right'}}>{task.title}</Text>
                                        <Text style={{color:'gray'}}>{index == task.children.length-1 ? 'Root' : 'Level ' + index}</Text>
                                    </View>
                                </View>
                            
                        </TouchableOpacity>
                    ))}

                </View>
                
            </View>
        )
    }
    else
    {
        return (<View></View>)
    }
    
  }

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

  // For editing title
  const [title, setTitle] = useState(task.title)
  const onChangeTitle = (newText: React.SetStateAction<string>) => {
    setTitle(newText);
    task.title = newText.toString()
    mainController.saveEditToTask(task)
  }

  // For changes in task
  useEffect(()=>{
    setTitle(task.title)
    setText(task.notes)
    setFiles(task.unobservedFiles)
    setObservedFiles(task.contextFiles)
    setContext(task.contextText)
    setUrls(task.extraMedia)
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
                        <Text style={{color: 'white'}}>Created by: {mainController.getUser().getValue()?.name}</Text> {/* Get creator name */}
                        <View style={[{width: "100%", flexDirection: isLeft ? 'row': 'row-reverse', alignItems: 'flex-end', justifyContent:'space-between'}, isLeft? {paddingRight: 30} : {paddingLeft:25}]}>

                            <View style={{flexDirection: isLeft ? 'row': 'row-reverse', width:'70%', alignItems:'flex-end'}}>
                                <TextInput 
                                style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:40, textAlign: isLeft ? 'left' : 'right', textAlignVertical:'bottom', minWidth:'70%', height: Math.max(50, (title.split('\n').length + Math.max(0, Math.ceil(title.replace(/\s+/g, '').length / 13)) - 1) * 50)}}
                                scrollEnabled={false}
                                onChangeText={onChangeTitle}
                                value={title}
                                multiline={true}
                                placeholder='Task Title...'
                                />
                            </View>
                            
                            <View style={{flexDirection:'column'}}>
                                {/*TODO: Generate this part of the task view*/}
                                <View style={{flexDirection: 'row', paddingVertical: 10, alignItems:'center'}}>
                                                                
                                    <CircularProgressBar percentage={task.getPercentCompleteness()} task={task}/>

                                    <Text style={{color: 'gray'}}>{(completion*100).toFixed(1)}%</Text>

                                </View>

                                <View style={{flexDirection: 'row', height: 50, width:100, backgroundColor:'black', borderRadius: 30, borderColor: 'white', borderWidth: 2, alignItems:'center', justifyContent:'center'}}>
                                    
                                    <TouchableOpacity onPress={()=>{controller.setInvitedUsers(true)}}>
                                        <Image
                                            style={{width: 20, height: 20, marginHorizontal: 10, opacity: !viewUsers ? 0.3 : 1}}
                                            source={require('../../assets/people_icon.png')}
                                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                        />
                                    </TouchableOpacity>
                                
                                    <TouchableOpacity onPress={()=>{controller.setInvitedUsers(false)}}>
                                            <Image
                                                style={{width: 20, height: 20, marginHorizontal: 10,  opacity: viewUsers ? 0.3 : 1}}
                                                source={require('../../assets/parent_tasks_icon.png')}
                                                resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                            />
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                            
                        </View>
                        {/* Display users/ancestor tasks */}
                        {!viewUsers && renderAncestors()}
                        {viewUsers && 
                        <View>
                            {/* Invite User */}
                            <InviteUser taskId={task.id} inviterId={inviterId} />  
                        </View>
                        }
                        
                        {/* View displaying dates */}
                        <View style={[{width:'100%', zIndex:4}, isLeft? {paddingRight: 30} : {paddingLeft:25}]}>
                            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:20, zIndex:4}}>
                                <View style={{flexDirection:'row'}}>
                                    <Image
                                        style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                        source={require('../../assets/calendar_icon.png')}
                                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                    />
                                    <Text style={{color:'gray'}}>Start Date</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <DateSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></DateSelector>
                                    <TimeSelector task={task} modStartDate={true} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></TimeSelector>
                                </View>
                                
                                {/* <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text> */}
                            </View>
                            
                            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10, zIndex:3}}>
                                <View style={{flexDirection:'row'}}>
                                <Image
                                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                    source={require('../../assets/calendar_icon.png')}
                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                />
                                <Text style={{color:'gray'}}>End Date</Text>
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    <DateSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></DateSelector>
                                    <TimeSelector task={task} modStartDate={false} updateFunctions={[setDuration, setDurationFromNow]} updateServer={true}></TimeSelector>
                                </View>
                                {/* <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text> */}
                            </View>
                            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                <View style={{flexDirection:'row'}}>
                                <Image
                                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                    source={require('../../assets/clock_icon.png')}
                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                />
                                <Text style={{color:'gray'}}>{task.children.length > 0 ? "Span" : "Duration"}</Text>
                                </View>
                                <Text style={{color:'gray'}}>{duration}</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                <View style={{flexDirection:'row'}}>
                                <Image
                                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                    source={require('../../assets/clock_icon.png')}
                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                />
                                <Text style={{color:'gray'}}>{task.children.length > 0 ? "Span" : "Duration"} From Now</Text>
                                </View>
                                <Text style={{color:'gray'}}>{durationFromNow}</Text>
                            </View>
                            { task.children.length == 0 &&
                                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                    <View style={{flexDirection:'row'}}>
                                    <Image
                                        style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                        source={require('../../assets/robot_icon.png')}
                                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                    />
                                    <Text style={{color:'gray'}}>Is Movable?</Text>
                                    </View>
                                    <TouchableOpacity onPress={()=>{task.isMovable = task.isMovable ? false : true; setIsMovable(task.isMovable);mainController.saveEditToTask(task)}}>
                                        <Text style={{color:'gray'}}>{isMovable ? 'Yes' : 'No'}</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                            
                        </View>

                        {/* Notes */}
                        <View style={[{ width: '100%', marginTop: 20 }, isLeft ? { paddingRight: 30 } : { paddingLeft: 35 }]}>
                             <Text style={{ color: 'white', fontFamily: fontsLoaded ? 'Inter_900Black' : 'Arial', fontSize: 20 }}>Notes</Text>
                            <TextInput
                                style={{ width: "100%", color: 'white', backgroundColor: 'rgba(50, 50, 50, 1)', borderRadius: 5, minHeight: 300, marginTop: 10, padding: 10, justifyContent: 'flex-start' }}
                                onChangeText={onChangeText}
                                value={text}
                                multiline={true}
                                placeholder="Enter text here..."
                                onSubmitEditing={onSubmitEditing}
                            />
                        </View>

                        {/* Extra Media */}
                        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
                            <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Extra Media</Text>
                            {/* Display list of items */}
                            <View style={{width:"100%", backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:5, marginTop:10, padding:10, justifyContent:'flex-start'}}>
                                <View style={{marginTop: 10, width:'100%', borderBottomColor:'white', borderBottomWidth:2, paddingBottom:20}}>
                                    {urlsMetadata && urlsMetadata.length > 0 && 
                                        urlsMetadata.map((item, index) => (
                                            <View style={{justifyContent:'center'}}>
                                                <TouchableOpacity key={urls[index]} style={{flexDirection:'row', padding:5, margin:5, width:200}} onPress={() => Linking.openURL(urls[index])}>
                                                    <Image
                                                        source={{ uri: item.image }}
                                                        style={{ width: 100, height: 100, borderRadius:10, marginRight: 10}} // Adjust the dimensions as needed
                                                    />
                                                    <View style={{flexDirection:'column'}}>
                                                        <Text numberOfLines={2} style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:15, color:'white', width:300,}}>{item.title}</Text>
                                                        <Text style={{color:'gray', width:300, height:75, overflow:'hidden'}}>{item.description}</Text>
                                                    </View>
                                                    
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{position:'absolute', backgroundColor:"#151515", height:30, width:30, borderRadius:20, borderWidth:5, borderColor:'#151515', justifyContent:'center', alignItems:'center', right:10}} onPress={()=>{handleDeleteMedia(item.url)}}>
                                                    <Image source={require('../../assets/x_mark_white.png')}  style={{width: 10, height: 10, marginHorizontal: 10}}></Image>
                                                </TouchableOpacity>
                                            </View>
                                        ))
                                    }
                                    {(!urlsMetadata ||( urlsMetadata.length == 0 && urls.length > 0 )) &&
                                        urls.map((item, index) => (
                                            <View>
                                                <Text key={index} style={{color:'white', paddingBottom: 10}}>{item}</Text>
                                                <TouchableOpacity style={{position:'absolute', backgroundColor:"#151515", height:30, width:30, borderRadius:20, borderWidth:5, borderColor:'#151515', justifyContent:'center', alignItems:'center', right:-10}} onPress={()=>{handleDeleteMedia(item)}}>
                                                    <Image source={require('../../assets/x_mark_white.png')}  style={{width: 10, height: 10, marginHorizontal: 10}}></Image>
                                                </TouchableOpacity>
                                            </View>
                                            
                                        ))
                                    }
                                </View>
                                <View style={{flexDirection:'row', width:'100%', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
                                    <TextInput
                                        style ={{color:"white", width:'95%'}}
                                        onChangeText={setUrlText}
                                        value={urlText}
                                        placeholder="Enter URL here..."
                                    />
                                    <TouchableOpacity onPress={handleAddItem}>
                                        <Image
                                            style={{width: 10, height: 10, marginHorizontal: 10, transform:[{rotate: '45deg'}], margin:5}}
                                            source={require('../../assets/x_mark_white.png')}
                                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                        />
                                    </TouchableOpacity>
                                </View>
                                
                            </View>
                        </View>

                        {/* Unobserved files */}
                        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
                            <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Unobserved Files</Text>
                            <View style={{flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap'}}>
                                {/* List of loaded files */}
                                <View style={{flexDirection:'row'}}>
                                    {files.map((item, index) => {
                                        let icon;
                                        if (item.name.endsWith('.pdf')) {
                                            icon = require('../../assets/pdficon.png');
                                        } else if (item.name.endsWith('.py')) {
                                            icon = require('../../assets/pythonicon.png');
                                        } else if (item.name.endsWith('.csv')) {
                                            icon = require('../../assets/csvicon.png');
                                        } else if (item.name.endsWith('.docx')){
                                            icon = require('../../assets/docxicon.png');
                                        }else if (item.name.endsWith('.java')){
                                            icon = require('../../assets/javaicon.png');
                                        }
                                        else if (item.name.endsWith('.cpp' || '.h' || '.hpp')){

                                            icon = require('../../assets/cppicon.png');

                                        }
                                        
                                        else {
                                            icon = require('../../assets/document_icon.png');
                                        }

                                        return (
                                        <View key={index} style={{width:150, height:150, borderRadius:10, backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:'center', alignItems:'center', margin:5}}>
                                            <Image source={icon} style={{width:120, height:120}}></Image>
                                            <Text style={{color:'white', textAlign:'center', fontSize:10}}>{item.name}</Text>
                                            <TouchableOpacity style={{position:'absolute', backgroundColor:"rgba(50, 50, 50, 1)", height:30, width:30, borderRadius:20, borderWidth:5, borderColor:'#151515', justifyContent:'center', alignItems:'center', top:-5, right:-10}} onPress={()=>{handleRemoveFile(item)}}>
                                                <Image source={require('../../assets/x_mark_white.png')}  style={{width: 10, height: 10, marginHorizontal: 10}}></Image>
                                            </TouchableOpacity>
                                        </View>
                                        );
                                    })}
                                </View>

                                {/* Add button */}
                                <TouchableOpacity onPress={handleFilePick}>
                                    <View style={{width:150, height:150, borderRadius:10, backgroundColor:"rgba(30, 30, 30, 1)", justifyContent:'center', alignItems:'center', margin:5}}>
                                        <Image source={require('../../assets/x_mark_white.png')}  style={{width: 10, height: 10, marginHorizontal: 10, transform:[{rotate: '45deg'}]}}></Image>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/*AI */}
                        <Text style={[{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:40}, {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>AI</Text>

                        {/* Context Prompt */}
                        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Context Prompt</Text>
                                <Text style={{color:'gray'}}>{context.length}/300</Text>
                            </View>
                            
                            <TextInput
                                style={{width:"100%", color:'white', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:5, minHeight: 200, marginTop:10, padding:10, justifyContent:'flex-start'}}
                                onChangeText={onChangeContext}
                                value={context}
                                multiline={true}
                                placeholder="Enter context here..."
                                onSubmitEditing={onSubmitContextEditing}
                            />
                        </View>

                        {/* Observed files */}
                        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Observed Files</Text>
                                <Text style={{color:'gray'}}>{observedFiles.length}/3</Text>
                            </View>
                            
                            <View style={{flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap'}}>
                                {/* List of loaded files */}
                                <View style={{flexDirection:'row'}}>
                                    {observedFiles.map((item, index) => {
                                        let icon;
                                        if (item.name.endsWith('.pdf')) {
                                            icon = require('../../assets/pdficon.png');
                                        } else if (item.name.endsWith('.py')) {
                                            icon = require('../../assets/pythonicon.png');
                                        } else if (item.name.endsWith('.csv')) {
                                            icon = require('../../assets/csvicon.png');
                                        } else if (item.name.endsWith('.docx')){
                                            icon = require('../../assets/docxicon.png');
                                        } else if (item.name.endsWith('.java')){
                                            icon = require('../../assets/javaicon.png');
                                        }
                                        else if (item.name.endsWith('.cpp' || '.h' || '.hpp')){

                                            icon = require('../../assets/cppicon.png');

                                        }
                                        else {
                                            icon = require('../../assets/document_icon.png');
                                        }

                                        return (
                                        <View key={index} style={{width:150, height:150, borderRadius:10, backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:'center', alignItems:'center', margin:5}}>
                                            <Image source={icon} style={{width:120, height:120}}></Image>
                                            <Text style={{color:'white', textAlign:'center', fontSize:10}}>{item.name}</Text>
                                            <TouchableOpacity style={{position:'absolute', backgroundColor:"rgba(50, 50, 50, 1)", height:30, width:30, borderRadius:20, borderWidth:5, borderColor:'#151515', justifyContent:'center', alignItems:'center', top:-5, right:-10}} onPress={()=>{handleRemoveContextFile(item)}}>
                                                <Image source={require('../../assets/x_mark_white.png')}  style={{width: 10, height: 10, marginHorizontal: 10}}></Image>
                                            </TouchableOpacity>
                                        </View>
                                        );
                                    })}
                                </View>

                                {/* Add button */}
                                <TouchableOpacity onPress={handleObservedFilePick}>
                                    <View style={{width:150, height:150, borderRadius:10, backgroundColor:"rgba(30, 30, 30, 1)", justifyContent:'center', alignItems:'center', margin:5}}>
                                        <Image source={require('../../assets/x_mark_white.png')}  style={{width: 10, height: 10, marginHorizontal: 10, transform:[{rotate: '45deg'}]}}></Image>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Subtasks */}
                        <View style={{width:'100%'}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end'}}>
                                <Text style={[{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:40}, {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>{task.children.length} Sub tasks</Text>
                                <TouchableOpacity style={{justifyContent:'center', alignItems:'center', width:30, height:30, backgroundColor:'rgba(50,50,50,1)', borderRadius:30, margin:5, marginRight:isLeft ? 20 : 0}} onPress={()=>{setNewTasks([...newTasks, new TaskModel(undefined, task.creatorId, task.rootId, task.users, undefined, "Sub Task " + (task.children.length + newTasks.length + 1), task.color, [task ,...task.ancestors], undefined, task.startDate.toISOString(), task.endDate.toISOString(), false)])}}>
                                    <Image
                                        style={{width: 10, height: 10, marginHorizontal: 10, transform:[{rotate: '45deg'}], margin:5}}
                                        source={require('../../assets/x_mark_white.png')}
                                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                    />
                                </TouchableOpacity>
                            </View>

                            {newTasks.length > 0 &&  
                            newTasks.toReversed().map((newTask, index) => (
                                <CreateSubTaskView parentTask={task} task={newTask} isLeft={isLeft} zIndex={newTasks.length - index} handleDeleteNewTask={handleDeleteNewTask}/>
                            ))
                            
                            }

                            {renderSubtasks()}

                            {/* Delete Subtask */}
                            <View style={{alignItems: isLeft? 'flex-start' : 'flex-end', zIndex:-999}}>
                                {deleteTaskClicked && 
                                    <View style={{width:'90%', borderRadius:10, backgroundColor:'rgba(30,30,30,1)', margin:10, padding:20, borderWidth:1, borderColor:'red'}}>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{color:'red', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Deleting Task</Text>
                                            <TouchableOpacity onPress={()=>{
                                                setDeleteInput('')
                                                setDeleteTaskClicked(false)
                                                }}>
                                            <Image
                                                style={{width: 10, height: 10, marginHorizontal: 10, margin:5}}
                                                source={require('../../assets/x_mark_white.png')}
                                                resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                            />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={{color:'gray', margin:20}}>In order to delete this task and all sub tasks stemming from this task, type: <Text style={{color:'#ff0000'}}>{task.title}</Text></Text>

                                        <View style={{flexDirection:'row', marginHorizontal:20, justifyContent:'space-around'}}>
                                            <TextInput
                                                style={{color:'white'}}
                                                placeholderTextColor="gray"
                                                onChangeText={setDeleteInput}
                                                value={deleteInput}
                                                placeholder={task.title}
                                            />
                                            <TouchableOpacity style={{height:40, paddingHorizontal:20, borderRadius:5, backgroundColor:validDeleteInput ? '#ff0000' : 'rgba(20,20,20,1)', alignItems:'center', justifyContent:'center', flexDirection:'row'}} onPress={()=>{
                                                if(validDeleteInput)
                                                    {
                                                        handleDeleteTask()
                                                        const mainController = MainController.getInstance();
                                                        mainController.setReRender(mainController.getReRender().getValue() ? false : true)
                                                    }
                                                    
                                            }}>
                                                <Text style={{color:!validDeleteInput ? '#ff0000' : 'rgba(20,20,20,1)'}}>Delete</Text>
                                                {validDeleteInput && 
                                                    <Image
                                                    style={{width: 20, height: 20, marginHorizontal: 10}}
                                                    source={require('../../assets/dark_trash_icon.png')}
                                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                                />
                                                }
                                                {!validDeleteInput && 
                                                    <Image
                                                    style={{width: 20, height: 20, marginHorizontal: 10}}
                                                    source={require('../../assets/red_trash_icon.png')}
                                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                                />
                                                }
                                                
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{height:40, paddingHorizontal:20, borderRadius:5, backgroundColor: 'rgba(20,20,20,1)', alignItems:'center', justifyContent:'center', flexDirection:'row'}}
                                            onPress={()=>{
                                                setDeleteInput('')
                                                setDeleteTaskClicked(false)
                                            }}
                                            >
                                                <Text style={{color:'white'}}>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                        
                                    </View>
                                    }
                                {!deleteTaskClicked && <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'rgba(20, 20, 20, 1)', margin:10, zIndex:-999, borderWidth: 1, borderColor:'red'}} onPress={()=>{setDeleteTaskClicked(true);scrollToBottom()}}>

                                    <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'red'}}>Delete</Text>
                                    <Image
                                        style={{width: 20, height: 20, marginHorizontal: 10}}
                                        source={require('../../assets/red_trash_icon.png')}
                                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                    />

                                </TouchableOpacity>}
                            </View>
                            

                        </View>
                        

                    </View>
                </View>

                
                
            </ScrollView>

            {viewTree &&
            <View  style={[{height: windowHeight, position:'absolute', top:0, width:windowWidth*0.515, backgroundColor:'#050505'}, isLeft ? {left:windowWidth*0.475} : {right:windowWidth*0.475}]}>
                <View style={[styles.container, isLeft ? styles.containerL : styles.containerR, {overflow:'hidden'}]}>
                    <Canvas/>

                </View>
                <View style={isLeft ? styles.gradientOverlayL : styles.gradientOverlayR}>
                    <LinearGradient
                    colors={[task.color, darkenColor(task.color, 0.9)]}              
                    style={styles.gradient}/>
                </View>
            </View>
            }
            
            {/* X and other page manipulation components */}
            <View style={[{width: '5%', minHeight:'100%', alignItems:'center', position:'absolute', top:20}, isLeft ? {right:20 - (viewTree ? windowWidth*0.51 : 0)} : {left:20 - (viewTree ? windowWidth*51 : 0)}]}>
                    <TouchableOpacity onPress={onPress}>
                        <Image source={require('../../assets/x_mark_white.png')} style={{width:20, height:20}}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity style={{position:'absolute', top:useWindowDimensions().height*0.49}} onPress={()=>{setViewTree(!viewTree)}}>
                        <Image source={require('../../assets/chev_white.png')} style={{width:30, height:20, transform:[{rotate: viewTree ? '90deg' : '-90deg'}]}}/>
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