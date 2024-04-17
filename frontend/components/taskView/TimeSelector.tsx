import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView, TextInput, Modal, FlatList, Image } from 'react-native';
import moment from 'moment';


const TimeSelector = () => {

    const [isSquareVisible, setIsSquareVisible] = useState(false);
    const [hours, setHours] = useState<string>("00");
    const [minutes, setMinutes] = useState<string>("00");
    const [isPM, setIsPM] = useState<boolean>(false);
    const [timeZone, setTimeZone] = useState<string>('EST');
    const [showTimeZoneModal, setShowTimeZoneModal] = useState<boolean>(false);

    const handleContainerClick = () => {
      setIsSquareVisible(!isSquareVisible);
    };

    const togglePeriod = () => {
      setIsPM(prevState => !prevState);
    };

    const handleTimeZoneChange = (zone: string) => {
      setTimeZone(zone);
      setShowTimeZoneModal(false);
    };

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

    const handleValidation = () => {
      const validationResult = validateAndExtractTime(hours, minutes);
      if (typeof validationResult === 'string') {
        alert(validationResult); // Show an alert with the error message
      } else {
        // Handle the valid time data here
        const { hour, minute } = validationResult;
        console.log(`Valid time: Hour ${hour}, Minute ${minute}`);
      }
    };
  
    const renderTimeZoneItem = ({ item }: { item: string }) => (
      <TouchableOpacity onPress={() => handleTimeZoneChange(item)} style={styles.timeZoneItem}>
        <Text>{item}</Text>
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleContainerClick}>
          <View style={[styles.pickerContainer, {alignItems:'flex-end'}]}>
              <Text style={{color:'gray'}}>4:00 PM EST</Text> 
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
              onChangeText={(text) => {setMinutes(text)}}
              maxLength={2}
            />
            <TouchableOpacity onPress={togglePeriod}>
              <Text style={styles.period}>{isPM ? 'PM' : 'AM'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleValidation}>
              <Image source={require('../../assets/chev_white.png')} style={{width:15, height:10, marginLeft:10, transform:[{rotate: '180deg'}]}}></Image>
            </TouchableOpacity>
          </View>
        </View>
        }
        
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    width:100,
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