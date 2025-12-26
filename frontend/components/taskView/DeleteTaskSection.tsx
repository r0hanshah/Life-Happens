import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';

import TaskModel from "../../models/TaskModel";
import MainController from "../../controllers/main/MainController";

const DeleteTaskSection: React.FC<{ task: TaskModel; isLeft: Boolean; fontsLoaded: boolean; mainController: MainController }> = ({ task, isLeft, fontsLoaded, mainController }) => {
    
    const [deleteTaskClicked, setDeleteTaskClicked] = useState(false)
    const [validDeleteInput, setValidDeleteInput] = useState(false)
    const [deleteInput, setDeleteInput] = useState("")

    const validateDelete = () => {
        setValidDeleteInput(deleteInput == task.title)
    }

    useEffect(() => {
        validateDelete()
    }, [deleteInput])

    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = () => {
        if (scrollViewRef.current)
            scrollViewRef.current.scrollToEnd({ animated: true });
    };

    const handleDeleteTask = () => {
        mainController.deleteTaskOnFirestore(task)
        if(task.isRoot)
        {
            mainController.deleteRootTask(task);
            return
        }
        else
        {
            const parent = task.ancestors[0]
            parent.children = parent.children.filter(inTask => inTask.id !== task.id);
            mainController.setSelectedTask(null)
        }
    }
    
    return (
        <View style={{width:'100%'}}>
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
                                style={{color:'white', paddingHorizontal:5}}
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
    )
}
export default DeleteTaskSection;