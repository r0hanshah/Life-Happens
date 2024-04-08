import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions, Text, TouchableHighlight, Image, TouchableOpacity, TextInput, Alert, Button, ScrollView } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';

import TaskModel from '../../models/TaskModel';
import TaskViewController from '../../controllers/taskView/TaskViewController';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';
import Circle from '../main/wireframe/ParentTaskCircle';
interface TaskViewProps {
  task: TaskModel;
  isLeft: Boolean;
  onPress: () => void;
}

const TaskView: React.FC<TaskViewProps> = ({ task, isLeft, onPress }) => {

  const controller = new TaskViewController(task);

  let [fontsLoaded] = useFonts({
    Inter_900Black
  });


  // For Notes section
  const [text, setText] = useState('');

  const onChangeText = (newText: React.SetStateAction<string>) => {
    setText(newText);
  };

  const onSubmitEditing = () => {
    // Handle submission logic here
    console.log('Submitted text:', text);
  };

  // For adding extra media
  const [urlText, setUrlText] = useState('');
  const [items, setItems] = useState<String[]>([]);

  const isURLValid = (url: string) => {
    // Simple URL validation regex
    const urlRegex = /^(http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  };

  const handleAddItem = () => {
    if (isURLValid(urlText)) {
      setItems([...items, urlText]);
      setUrlText('');
    } else {
      Alert.alert('Invalid URL', 'Please enter a valid URL');
    }
  };

  return(
    <View style={{overflow:'hidden', minHeight:'100%'}}>
        <View style={isLeft ? styles.gradientOverlayL : styles.gradientOverlayR}>
            <LinearGradient
            colors={[task.color, darkenColor(task.color, 0.9)]}              
            style={styles.gradient}/>
        </View>
        <View style={[styles.container, isLeft ? styles.containerL : styles.containerR]}>

            <ScrollView style={{ height: useWindowDimensions().height - 20 }}>
                <View style ={{flexDirection: isLeft ? 'row' : 'row-reverse', width:'100%', paddingBottom: 20}}>
                    {/* Circle with wire extending from it */}
                    <View style={{width: '15%', alignItems:'center'}}>
                        <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: task.color, marginTop:27}}/>
                    </View>

                    {/* Content */}
                    <View style={{width:'80%', alignItems: isLeft ? 'flex-start' : 'flex-end'}}>
                        <Text style={{color: 'white'}}>Created by: Daniel Parra</Text> {/* Get creator name */}
                        <View style={{width: "100%", flexDirection: isLeft ? 'row': 'row-reverse', alignItems: isLeft ? 'flex-start' : 'flex-end', justifyContent:'space-between'}}>
                            <View style={{flexDirection: isLeft ? 'row': 'row-reverse'}}>
                                <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:40}}>{task.title}</Text>

                                <View style={{flexDirection: 'row', marginHorizontal: 20, backgroundColor:'black', borderRadius: 30, borderColor: 'white', borderWidth: 2, alignItems:'center'}}>
                                    
                                    <TouchableOpacity onPress={()=>{controller.setInvitedUsers(true)}}>
                                        <Image
                                            style={{width: 20, height: 20, marginHorizontal: 10, opacity: controller.getViewInvitedUsers() ? 0.3 : 1}}
                                            source={require('../../assets/people_icon.png')}
                                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                        />
                                    </TouchableOpacity>
                                
                                <TouchableOpacity onPress={()=>{controller.setInvitedUsers(false)}}>
                                        <Image
                                            style={{width: 20, height: 20, marginHorizontal: 10,  opacity: !controller.getViewInvitedUsers() ? 0.3 : 1}}
                                            source={require('../../assets/parent_tasks_icon.png')}
                                            resizeMode="cover" // or "contain", "stretch", "repeat", "center"
                                        />
                                </TouchableOpacity>
                                    
                                </View>


                            </View>
                            

                            {/*TODO: Generate this part of the task view*/}
                            <View style={{flexDirection: 'row', marginHorizontal: 20, padding: 10, alignItems:'center'}}>
                                
                                <View style={{width: 30, height: 30, borderRadius: 30, borderWidth: 2, borderColor: 'gray', marginRight:10}}></View>

                                <Text style={{color: 'gray'}}>0%</Text>

                            </View>
                        </View>
                        
                        {/* View displaying dates */}
                        <View style={[{width:'100%'}, isLeft? {paddingRight: 30} : {paddingLeft:25}]}>
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
                                    {items.map((item, index) => (
                                    <Text key={index} style={{color:'white', paddingBottom: 10}}>{item}</Text>
                                    ))}
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
                                            style={{width: 10, height: 10, marginHorizontal: 10, transform:[{rotate: '45deg'}]}}
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
                            <TextInput
                                style={{width:"100%", color:'white', backgroundColor:'rgba(50, 50, 50, 1)', borderRadius:5, minHeight: 300, marginTop:10, padding:10, justifyContent:'flex-start'}}
                                onChangeText={onChangeText}
                                value={text}
                                multiline={true}
                                placeholder="Enter text here..."
                                onSubmitEditing={onSubmitEditing}
                            />
                        </View>
                    </View>
                </View>
                
            </ScrollView>
            

            {/* X and other page manipulation components */}
            <View style={{width: '5%', minHeight:'100%'}}>
                <TouchableOpacity onPress={onPress}>
                    <Image source={require('../../assets/x_mark_white.png')} style={{width:20, height:20}}></Image>
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
        padding: 20,
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