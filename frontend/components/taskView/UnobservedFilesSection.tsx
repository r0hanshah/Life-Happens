import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import TaskModel from "../../models/TaskModel";
import MainController from "../../controllers/main/MainController";

const UnobservedFilesSection: React.FC<{task: TaskModel, isLeft: Boolean, fontsLoaded: boolean, mainController: MainController}> = ({task, isLeft, fontsLoaded, mainController}) => {
    
    const [files, setFiles] = useState<DocumentPicker.DocumentPickerAsset[]>(task.unobservedFiles);

    useEffect(() => {
        setFiles(task.unobservedFiles);
    }, [task]);

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

    return (
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
                        else if (item.name.endsWith('.cpp') || item.name.endsWith('.h') || item.name.endsWith('.hpp')) {

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
    );
}

export default UnobservedFilesSection;
