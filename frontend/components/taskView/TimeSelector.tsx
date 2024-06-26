import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView, TextInput, Modal, FlatList, Image } from 'react-native';
import moment, { Duration } from 'moment';
import TaskModel from '../../models/TaskModel';
import MainController from '../../controllers/main/MainController';


const TimeSelector =({task, modStartDate, updateFunctions, updateServer} : {task:TaskModel, modStartDate:boolean, updateFunctions:Array<(duration:string) => void>, updateServer:boolean}) => {

    const [isSquareVisible, setIsSquareVisible] = useState(false);
    const [hours, setHours] = useState<string>(modStartDate ? (task.startDate.getHours() > 12 ? task.startDate.getHours() - 12 : task.startDate.getHours()).toString() :(task.endDate.getHours() > 12 ? task.endDate.getHours() - 12 : task.endDate.getHours()).toString());
    const [hoursInt, setHoursInt] = useState<number>(parseInt(hours))

    const [minutes, setMinutes] = useState<string>(modStartDate ? task.startDate.getMinutes().toString().length <= 1 ? ('00'+task.startDate.getMinutes().toString()).slice(-2) : task.startDate.getMinutes().toString()  : task.endDate.getMinutes().toString().length <= 1 ? ('00'+task.endDate.getMinutes().toString()).slice(-2) : task.endDate.getMinutes().toString());
    
    const [minInts, setMinInts] = useState<number>(parseInt(minutes))
    const [isPM, setIsPM] = useState<boolean>((modStartDate ? task.startDate.getHours() > 12 : task.endDate.getHours() > 12));

    const mainController = MainController.getInstance();

    useEffect(()=>{
      const popupListener = mainController.getToggledPopupKey();
  
      const listener = (key:string) => {
        setIsSquareVisible(mainController.getToggledPopupKey().getValue() == task.id + 't' + modStartDate)
      };
  
      popupListener.addListener(listener)
  
      return () => {
          popupListener.removeListener(listener);
      }
  
    },[mainController])

    const handleContainerClick = () => {
      mainController.setToggledPopupKey(mainController.getToggledPopupKey().getValue() == task.id+'t'+modStartDate ? '' : task.id + 't' + modStartDate)
      setIsSquareVisible(mainController.getToggledPopupKey().getValue() == task.id + 't' + modStartDate);
    };

    const togglePeriod = () => {
      setIsPM(prevState => !prevState);
    };

    useEffect(()=>{
      setHours(modStartDate ? (task.startDate.getHours() > 12 ? task.startDate.getHours() - 12 : task.startDate.getHours()).toString() :(task.endDate.getHours() > 12 ? task.endDate.getHours() - 12 : task.endDate.getHours()).toString());
      setHoursInt(modStartDate ? (task.startDate.getHours() > 12 ? task.startDate.getHours() - 12 : task.startDate.getHours()) :(task.endDate.getHours() > 12 ? task.endDate.getHours() - 12 : task.endDate.getHours()))
      setMinutes(modStartDate ? task.startDate.getMinutes().toString().length <= 1 ? ('00'+task.startDate.getMinutes().toString()).slice(-2) : task.startDate.getMinutes().toString()  : task.endDate.getMinutes().toString().length <= 1 ? ('00'+task.endDate.getMinutes().toString()).slice(-2) : task.endDate.getMinutes().toString());
      setMinInts(modStartDate ? task.startDate.getMinutes() : task.endDate.getMinutes())
      setIsPM((modStartDate ? task.startDate.getHours() > 12 : task.endDate.getHours() > 12));
      updateFunctions.at(0)!(calculateDuration(task.startDate, task.endDate))
      updateFunctions.at(1)!(calculateDuration(new Date(), task.endDate))
    }, [task])

    const validateAndExtractTime = (hourStr: string, minuteStr: string): { hour: number, minute: number } | string => {
      // Validate hour string
      const hour = parseInt(hourStr);
      if (isNaN(hour) || hour <= 0 || hour > 12) {
          return 'Invalid hour value. Please enter a number between 1 and 12.';
      }
  
      // Validate minute string
      const minute = parseInt(minuteStr);
      if (isNaN(minute) || minute < 0 || minute > 59) {
          return 'Invalid minute value. Please enter a number between 0 and 59.';
      }
  
      // If both hour and minute are valid, return them
      return { hour, minute };
    };

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

    const handleValidation = () => {
      const validationResult = validateAndExtractTime(hours, minutes);
      if (typeof validationResult === 'string') {
        alert(validationResult); // Show an alert with the error message
      } else {
        // Handle the valid time data here
        const { hour, minute } = validationResult;
        setHoursInt(hour);
        setMinInts(minute);

        setHours(hour.toString());
        setMinutes(minutes.toString().length <= 1 ? ('00'+minutes.toString()).slice(-2) : minutes.toString());

        (modStartDate ? task.startDate : task.endDate).setHours(hour + (isPM ? 12 : 0));
        (modStartDate ? task.startDate : task.endDate).setMinutes(minute);
        for(const parent of task.ancestors)
        {
          if(modStartDate ? parent.endDate < task.endDate : parent.startDate > task.startDate)
            if(modStartDate) { parent.startDate = task.startDate }
            else { parent.endDate = task.endDate}
            
        }
        updateFunctions.at(0)!(calculateDuration(task.startDate, task.endDate))
        updateFunctions.at(1)!(calculateDuration(new Date(), task.endDate))
        if(updateServer)
        {
          MainController.getInstance().saveEditToTask(task)
        }
        
        mainController.setToggledPopupKey('')
        setIsSquareVisible(false);
      }
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleContainerClick}>
          <View style={[styles.pickerContainer, {alignItems:'flex-end'}]}>
              <Text style={{color:'gray'}}>{hours}:{minutes} {isPM ? 'PM' : 'AM'}</Text> 
          </View>
        </TouchableOpacity>
        {isSquareVisible && 
        <View  style={[styles.square]}>
          <View style={styles.timeInput}>
            <TextInput
              style={styles.input}
              value={hours}
              onChangeText={(text) => {setHours(text)}}
              keyboardType='numeric'
              maxLength={2}
            />
            <Text style={[styles.separator, {color:'gray'}]}>:</Text>
            <TextInput
              style={styles.input}
              value={minutes}
              keyboardType='numeric'
              onChangeText={(text) => {
                setMinutes(text)
              }}
              maxLength={2}
            />
            <TouchableOpacity onPress={togglePeriod}>
              <Text style={styles.period}>{isPM ? 'PM' : 'AM'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleValidation}>
              <Image source={require('../../assets/chev_white.png')} style={{width:20, height:10, marginLeft:10, transform:[{rotate: '180deg'}]}}></Image>
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
    alignItems: 'flex-end',
  },
  pickerContainer: {
    width:80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:1
  },
  square: {
    width: 230,
    height: 70,
    position:'absolute',
    backgroundColor: 'rgba(30,30,30,1)',
    marginTop:100,
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
  },
  input: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
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

export default TimeSelector;