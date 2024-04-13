import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions, Text, Image, TouchableOpacity, TextInput, Alert, Button, ScrollView, FlatList, Platform, Linking } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

import TaskModel from '../../models/TaskModel';
import TaskViewController from '../../controllers/taskView/TaskViewController';
import MainController from '../../controllers/main/MainController';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import CircularProgressBar from './CircularProgressView';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface TaskViewProps {
  task: TaskModel;
  isLeft: Boolean;
  onPress: () => void;
}

const TaskView: React.FC<TaskViewProps> = ({ task, isLeft, onPress }) => {

  const controller = new TaskViewController(task);
  const [viewUsers, setViewUsers] = useState(false)
  const [isMovable, setIsMovable] = useState(task.isMovable)

  let [fontsLoaded] = useFonts({
    Inter_900Black
  });

  // For date pickers
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event: { target: { value: string | number | Date; }; }) => {
    const selectedDate = new Date(event.target.value);
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // For progress circle
  const [completion, setCompletion] = useState(task.getPercentCompleteness())
  
  useEffect(() => {
    const taskListener = controller.getViewInvitedUsers();

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

  const [urlsMetadata, setUrlsMetadata] = useState<{ title: string; description: string; image: string; }[] | null>([]);

  const handleAddItem = () => {
    if (isValidUrl(urlText)) {
      setUrls([...urls, urlText]);
      task.extraMedia = [...urls, urlText]
      setUrlText('');
    } else {
      alert('Invalid URL');
    }
  };

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
        }));
        setUrlsMetadata(extractedData);
    };
    fetchUrlsMetadata();
  }, [urls]);


  // For Notes section
  const [text, setText] = useState('');

  const onChangeText = (newText: React.SetStateAction<string>) => {
    setText(newText);
  };

  const onSubmitEditing = () => {
    // Handle submission logic here
    console.log('Submitted text:', text);
  };

  // For AI Context Prompt section
  const [context, setContext] = useState('');

  const onChangeContext = (newText: React.SetStateAction<string>) => {
    setContext(newText);
  };

  const onSubmitContextEditing = () => {
    // Handle submission logic here
    console.log('Submitted text:', text);
  };

  // For adding unobserved files
  const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  // Function to handle file selection
  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (result && result.assets) {
        // Add the selected file to the files array
        setFiles([...files, result.assets.at(0)!]);
      }
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

  // For adding AI observed files
  const [observedFiles, setObservedFiles] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  // Function to handle file selection
  const handleObservedFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

      if (result && result.assets) {
        // Add the selected file to the files array
        setObservedFiles([...observedFiles, result.assets.at(0)!]);
      }
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

  // For Creating subtask
  const [createSubTask, setCreateSubTask] = useState<boolean>(false);
  

  // Render subtasks
  const renderSubtasks = () => {
    if( task.children.length > 0)
    {
        return (


                <View style={{alignItems: isLeft? 'flex-start' : 'flex-end', marginTop:20}}>

                    {task.children.map((task, index) => (
                        <TouchableOpacity key={index} style={{flexDirection:isLeft? 'row' : 'row-reverse', justifyContent:'space-between', height:50, width:'95%', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:30, alignItems:'center', marginTop: 10}} onPress={()=>{MainController.getInstance().setSelectedTask(task)}}>
                            
                                <View style={{flexDirection:isLeft? 'row' : 'row-reverse', alignItems:'center'}}>
                                    <View style={{backgroundColor:task.color, width: 20, height:20, borderRadius:20, margin:10}}/>
                                    <Text style={{color:'white'}}>{task.title}</Text>
                                </View>
                                <Text style={{color:'white'}}>{task.children.length == 0 ? 'Leaf Task' : task.children.length +' Sub Tasks'}</Text>
                                <View style={{flexDirection: 'row', marginHorizontal: 20, padding: 10, alignItems:'center'}}>

                                        <CircularProgressBar percentage={task.getPercentCompleteness()}></CircularProgressBar>

                                        <Text style={{color: 'gray'}}>{(task.getPercentCompleteness()*100).toFixed(1)}%</Text>

                                </View>
                                <View style={[{height:2, width: 50, position:'absolute', backgroundColor:task.color}, isLeft?{ marginLeft:-50} : { marginRight:-50}]}></View>
                                <View style={[{height:60, width: 2.5, position:'absolute', backgroundColor:task.color, marginTop:-58}, isLeft ? {marginLeft:-50.5} : {marginRight:-50.5}]}></View>
                            
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'rgba(50, 50, 50, 1)', margin:10}}>

                    <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>Generate Subtasks</Text>
                    <Image
                        style={{width: 20, height: 20, marginHorizontal: 10}}
                        source={require('../../assets/robot_icon.png')}
                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                    />

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

                <TouchableOpacity style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:50, width:"90%", borderRadius:10, backgroundColor:'rgba(50, 50, 50, 1)', margin:10}}>

                <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white'}}>Generate Subtasks</Text>
                <Image
                    style={{width: 20, height: 20, marginHorizontal: 10}}
                    source={require('../../assets/robot_icon.png')}
                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                />

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
        console.log("no ancestors")
        return (<View></View>)
    }
    
  }


  return(
    <View style={{overflow:'hidden', minHeight:'100%'}}>
        <View style={isLeft ? styles.gradientOverlayL : styles.gradientOverlayR}>
            <LinearGradient
            colors={[task.color, darkenColor(task.color, 0.9)]}              
            style={styles.gradient}/>
        </View>
        <View style={[styles.container, isLeft ? styles.containerL : styles.containerR]}>

            <ScrollView style={{ height: useWindowDimensions().height - 20, padding:39 }}>
                <View style ={{flexDirection: isLeft ? 'row' : 'row-reverse', width:'100%', paddingBottom: 20}}>

                    {/* Circle with wire extending from it */}
                    <View style={{width: '15%', alignItems:'center'}}>
                        <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: task.color, marginTop:27}}/>
                        {(task.children.length > 0 || createSubTask)  && <View style={{width:3, height: task.children.length > 0 ? '90.65%' : '78%', backgroundColor: task.color}}></View>}
                    </View>

                    {/* Content */}
                    <View style={{width:'80%', alignItems: isLeft ? 'flex-start' : 'flex-end'}}>
                        <Text style={{color: 'white'}}>Created by: Daniel Parra</Text> {/* Get creator name */}
                        <View style={{width: "100%", flexDirection: isLeft ? 'row': 'row-reverse', alignItems: isLeft ? 'flex-start' : 'flex-end', justifyContent:'space-between'}}>

                            <View style={{flexDirection: isLeft ? 'row': 'row-reverse', width:'70%', alignItems:'flex-end'}}>

                                <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:40, textAlign: isLeft ? 'left' : 'right'}}>{task.title}</Text>

                                <View style={{flexDirection: 'row', marginHorizontal: 20, height: 50, backgroundColor:'black', borderRadius: 30, borderColor: 'white', borderWidth: 2, alignItems:'center'}}>
                                    
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
                            

                            {/*TODO: Generate this part of the task view*/}
                            <View style={{flexDirection: 'row', marginHorizontal: 20, padding: 10, alignItems:'center'}}>
                                
                                <CircularProgressBar percentage={completion}></CircularProgressBar>

                                <Text style={{color: 'gray'}}>{(completion*100).toFixed(1)}%</Text>

                            </View>
                        </View>
                        {/* Display users/ancestor tasks */}
                        {!viewUsers && renderAncestors()}

                        {showDatePicker && (
                             <input type="date" value={date.toISOString().split('T')[0]} onChange={onChange} />
                        )}
                        
                        {/* View displaying dates */}
                        <View style={[{width:'100%'}, isLeft? {paddingRight: 30} : {paddingLeft:25}]}>
                            <TouchableOpacity onPress={showDatepicker}>
                                <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:20}}>
                                    <View style={{flexDirection:'row'}}>
                                        <Image
                                            style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                            source={require('../../assets/calendar_icon.png')}
                                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                        />
                                        <Text style={{color:'gray'}}>Start Date</Text>
                                    </View>
                                    <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                <View style={{flexDirection:'row'}}>
                                <Image
                                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                    source={require('../../assets/calendar_icon.png')}
                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                />
                                <Text style={{color:'gray'}}>End Date</Text>
                                </View>
                                <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text>
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
                                <Text style={{color:'gray', marginHorizontal: 10}}>7 days</Text>
                            </View>
                            <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                <View style={{flexDirection:'row'}}>
                                <Image
                                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                    source={require('../../assets/robot_icon.png')}
                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                />
                                <Text style={{color:'gray'}}>Is Movable?</Text>
                                </View>
                                <TouchableOpacity onPress={()=>{task.isMovable = task.isMovable ? false : true; setIsMovable(task.isMovable)}}>
                                    <Text style={{color:'gray', marginHorizontal: 10}}>{isMovable ? 'Yes' : 'No'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>


                        {/* Notes */}
                        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
                            <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Notes</Text>
                            <TextInput
                                style={{width:"100%", color:'white', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:5, minHeight: 300, marginTop:10, padding:10, justifyContent:'flex-start'}}
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
                                <View style={{marginTop: 10, width:'100%', borderBottomColor:'white', borderBottomWidth:2}}>
                                    {urlsMetadata && urlsMetadata.length > 0 && 
                                        urlsMetadata.map((item, index) => (
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
                                        ))
                                    }
                                    {(!urlsMetadata ||( urlsMetadata.length == 0 && urls.length > 0 )) &&
                                        urls.map((item, index) => (
                                            <Text key={index} style={{color:'white', paddingBottom: 10}}>{item}</Text>
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

                        {/*Unobserved files */}
                        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
                            <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Unobserved Files</Text>
                            <View style={{flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap'}}>
                                {/* List of loaded files */}
                                <View style={{flexDirection:'row'}}>
                                    {files.map((item, index) => (
                                    <View style={{width:150, height:150, borderRadius:10, backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:'center', alignItems:'center', margin:5}}>
                                        <Image source={require('../../assets/document_icon.png')} style={{width:120, height:120}}></Image>
                                        <Text style={{color:'white', textAlign:'center', fontSize:10}}>{item.name}</Text>
                                    </View>
                                    ))}
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

                        {/*Observed files */}
                        <View style={[ {width:'100%', marginTop:20}, isLeft? {paddingRight: 30} : {paddingLeft:35}]}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:20}}>Observed Files</Text>
                                <Text style={{color:'gray'}}>{observedFiles.length}/3</Text>
                            </View>
                            
                            <View style={{flexDirection:'row', alignItems:'flex-start', flexWrap: 'wrap'}}>
                                {/* List of loaded files */}
                                <View style={{flexDirection:'row'}}>
                                    {observedFiles.map((item, index) => (
                                    <View style={{width:150, height:150, borderRadius:10, backgroundColor:"rgba(50, 50, 50, 1)", justifyContent:'center', alignItems:'center', margin:5}}>
                                        <Image source={require('../../assets/document_icon.png')} style={{width:120, height:120}}></Image>
                                        <Text style={{color:'white', textAlign:'center', fontSize:10}}>{item.name}</Text>
                                    </View>
                                    ))}
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
                                <TouchableOpacity style={{justifyContent:'center', alignItems:'center', width:30, height:30, backgroundColor:'rgba(50,50,50,1)', borderRadius:30, margin:5, marginRight:isLeft ? 20 : 0}} onPress={()=>{setCreateSubTask(true)}}>
                                    <Image
                                        style={{width: 10, height: 10, marginHorizontal: 10, transform:[{rotate: '45deg'}], margin:5}}
                                        source={require('../../assets/x_mark_white.png')}
                                        resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                    />
                                </TouchableOpacity>
                            </View>

                            {createSubTask &&  
                            <View style={{alignItems: isLeft? 'flex-start' : 'flex-end', marginTop:20}}>
                                <View style={{flexDirection:'column', alignItems:'flex-start',  height:250, width:'95%', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:30}}>
                                    <View  style={{flexDirection:isLeft? 'row' : 'row-reverse', justifyContent:'space-between', marginTop: 10, width:'100%', alignItems:'center'}}>
                                            
                                            <View style={{flexDirection:isLeft? 'row' : 'row-reverse', alignItems:'center'}}>
                                                <View style={{backgroundColor:task.color, width: 20, height:20, borderRadius:20, margin:10}}/>
                                                <Text style={{color:'white'}}>Sub Task {task.children.length + 1}</Text>
                                            </View>
                                            <Text style={{color:'white'}}>Leaf Task</Text>
                                            <View style={{flexDirection: 'row', marginHorizontal: 20, padding: 10, alignItems:'center'}}>
                                                    
                                                    <View style={{width: 30, height: 30, borderRadius: 30, borderWidth: 2, borderColor: 'gray', marginRight:10}}></View>

                                                    <Text style={{color: 'gray'}}>0%</Text>

                                            </View>
                                            <View style={[{height:2, width: 50, position:'absolute', backgroundColor:task.color}, isLeft?{ marginLeft:-50} : { marginRight:-50}]}></View>
                                            <View style={[{height:50, width: 2.5, position:'absolute', backgroundColor:task.color, marginTop:-48}, isLeft ? {marginLeft:-50.5} : {marginRight:-50.5}]}></View>
                                        
                                    </View>

                                    {/* Set start date and end date and say whether the event is movable */}
                                    <View style={[{width:'100%', paddingHorizontal:25}]}>
                                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop:20}}>
                                            <View style={{flexDirection:'row'}}>
                                                <Image
                                                    style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                                    source={require('../../assets/calendar_icon.png')}
                                                    resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                                />
                                                <Text style={{color:'gray'}}>Start Date</Text>
                                            </View>
                                            <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                            <View style={{flexDirection:'row'}}>
                                            <Image
                                                style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                                source={require('../../assets/calendar_icon.png')}
                                                resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                            />
                                            <Text style={{color:'gray'}}>End Date</Text>
                                            </View>
                                            <Text style={{color:'gray', marginHorizontal: 10}}>Monday, April 27, 2024 | 4:00 PM EST</Text>
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
                                            <Text style={{color:'gray', marginHorizontal: 10}}>7 days</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10}}>
                                            <View style={{flexDirection:'row'}}>
                                            <Image
                                                style={{width: 20, height: 20, marginHorizontal: 10, opacity:0.3}}
                                                source={require('../../assets/robot_icon.png')}
                                                resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                            />
                                            <Text style={{color:'gray'}}>Is Movable?</Text>
                                            </View>
                                            <Text style={{color:'gray', marginHorizontal: 10}}>Yes</Text>
                                        </View>
                                    </View>

                                    {/* Cancel or Create sub task */}
                                    <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', paddingHorizontal: 25, paddingVertical:10}}>
                                        <TouchableOpacity onPress={()=>{setCreateSubTask(false)}}>
                                            <Text style={{color:'white'}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <Text style={{color:'white'}}>Create Sub Task</Text>
                                        </TouchableOpacity>
                                    </View>


                                </View>
                                
                            </View>
                            }

                            {renderSubtasks()}

                        </View>
                        

                    </View>
                </View>

                {/* X and other page manipulation components */}
                <View style={[{width: '5%', minHeight:'100%', alignItems:'center', position:'absolute'}, isLeft ? {right:10} : {left:10}]}>
                    <TouchableOpacity onPress={onPress}>
                        <Image source={require('../../assets/x_mark_white.png')} style={{width:20, height:20}}></Image>
                    </TouchableOpacity>
                </View>
                
            </ScrollView>
            

            
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