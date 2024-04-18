import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView, TextInput, Modal, FlatList, Image } from 'react-native';
import moment, { Duration } from 'moment';
import TaskModel from '../../models/TaskModel';

import MainController from '../../controllers/main/MainController';


const ColorSelector =({task, isLeft, updateFunctions} : {task:TaskModel, isLeft:Boolean, updateFunctions:Array<(duration:string) => void>}) => {

    const [isSquareVisible, setIsSquareVisible] = useState(false);
    const [hexCode, setHexCode] = useState(task.color.substring(1))
   
    const handleContainerClick = () => {
      setIsSquareVisible(!isSquareVisible);
    };

    const handleChangeColor = () => {
      const hexRegex = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

      if (hexRegex.test(hexCode))
      {
        task.color = "#" + hexCode
        const mainController = MainController.getInstance();
        mainController.setReRender(mainController.getReRender().getValue() ? false : true)
      }
      else
      {
        setHexCode(task.color.substring(1))
      }
    }

    return (
      <View style={[styles.container, {alignItems: isLeft ? 'flex-start' : 'flex-end',}]}>
        <TouchableOpacity onPress={handleContainerClick}>
            <View style={{width: 30, height: 30, borderRadius: 15, backgroundColor: task.color, marginTop:27}}/>
        </TouchableOpacity>
        {isSquareVisible && 
        <View  style={[styles.square]}>
          <View style={[styles.timeInput, {width:'90%'}]}>
            <View style={{width: 20, height: 20, borderRadius: 15, backgroundColor: "#" + hexCode}}/>
            <Text style={{color:'white', marginHorizontal:10}}>#</Text>
            <TextInput
              style={styles.input}
              value={hexCode}
              onChangeText={(text) => {setHexCode(text)}}
              maxLength={6}
            />
            <TouchableOpacity onPress={() => {handleChangeColor()}}>
              <Image source={require('../../assets/chev_white.png')} style={{width:15, height:10, marginLeft:10, transform:[{rotate: '180deg'}]}}></Image>
            </TouchableOpacity>
          </View>
          <View style={{margin:10, width:'90%'}}>
            <TouchableOpacity style={{flexDirection:'row', width:'95%', justifyContent:'flex-start', marginVertical:5}} onPress={()=>{setHexCode("FF0000")}}>
                <View style={{width: 20, height: 20, borderRadius: 15, backgroundColor: "#FF0000"}}/>
                <Text style={{color:'white', marginLeft:20}}>Red</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', width:'95%', justifyContent:'flex-start', marginVertical:5}} onPress={()=>{setHexCode("FFA800")}}>
                <View style={{width: 20, height: 20, borderRadius: 15, backgroundColor: "#FFA800"}}/>
                <Text style={{color:'white', marginLeft:20}}>Orange</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', width:'95%', justifyContent:'flex-start', marginVertical:5}} onPress={()=>{setHexCode("FFF500")}}>
                <View style={{width: 20, height: 20, borderRadius: 15, backgroundColor: "#FFF500"}}/>
                <Text style={{color:'white', marginLeft:20}}>Yellow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', width:'95%', justifyContent:'flex-start', marginVertical:5}} onPress={()=>{setHexCode("24FF00")}}>
                <View style={{width: 20, height: 20, borderRadius: 15, backgroundColor: "#24FF00"}}/>
                <Text style={{color:'white', marginLeft:20}}>Green</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', width:'95%', justifyContent:'flex-start', marginVertical:5}} onPress={()=>{setHexCode("0038FF")}}>
                <View style={{width: 20, height: 20, borderRadius: 15, backgroundColor: "#0038FF"}}/>
                <Text style={{color:'white', marginLeft:20}}>Blue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', width:'95%', justifyContent:'flex-start', marginVertical:5}} onPress={()=>{setHexCode("35EDF9")}}>
                <View style={{width: 20, height: 20, borderRadius: 15, backgroundColor: "#35EDF9"}}/>
                <Text style={{color:'white', marginLeft:20}}>Light Blue</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flexDirection:'row', width:'95%', justifyContent:'flex-start', marginVertical:5}} onPress={()=>{setHexCode("8001FF")}}>
                <View style={{width: 20, height: 20, borderRadius: 15, backgroundColor: "#8001FF"}}/>
                <Text style={{color:'white', marginLeft:20}}>Purple</Text>
            </TouchableOpacity>
          </View>
        </View>
        }
        
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    width:80,
    justifyContent: 'center',
  },
  pickerContainer: {
    width:80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:1
  },
  square: {
    width: 200,
    height: 300,
    position:'absolute',
    backgroundColor: 'rgba(30,30,30,1)',
    marginTop:380,
    marginRight:0,
    zIndex:1,
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 20,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    minWidth:100
  },
  calendarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  yearDropdown: {
    position: 'absolute',
    top:'100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: 'white',
    borderWidth: 1,
    height:100
  },
  dayColumn: {
    width: '14%',
    alignItems: 'center',
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  disabledDay: {
    backgroundColor: '#ddd',
  },
  today: {
    backgroundColor: 'lightblue',
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  input: {
    width: 80,
    height: 40,
    padding: 10,
    marginRight: 5,
    fontSize: 16,
    color:'white',
  },
  separator: {
    fontSize: 20,
    marginRight:5
  },
  period: {
    fontSize: 16,
    marginLeft: 5,
    color:'gray'
  },
  timezone: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeZoneItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  closeButton: {
    marginTop: 20,
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default ColorSelector;