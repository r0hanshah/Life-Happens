import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import moment from 'moment';


const TimeSelector = () => {

    const [isSquareVisible, setIsSquareVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [isYearDropdownVisible, setIsYearDropdownVisible] = useState(false);
  
    const handleContainerClick = () => {
      setIsSquareVisible(!isSquareVisible);
    };
  
    const handlePrevMonth = () => {
      const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
      setSelectedMonth(prevMonth);
    };
  
    const handleNextMonth = () => {
      const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
      setSelectedMonth(nextMonth);
    };
  
    const handlePrevYear = () => {
      setSelectedYear(selectedYear - 1);
    };
  
    const handleNextYear = () => {
      setSelectedYear(selectedYear + 1);
    };
  
    const handleYearSelect = (year:number) => {
      setSelectedYear(year);
      setIsYearDropdownVisible(false);
    };

    const handleDaySelect = (day:number|"") => {

    }
  
    const renderMonthsDropdown = () => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      return (
        <View style={[styles.dropdownContainer, {width:'50%'}]}>
          <TouchableOpacity onPress={handlePrevMonth}>
            <Text>{'<'}</Text>
          </TouchableOpacity>
          <Text>{months[selectedMonth]}</Text>
          <TouchableOpacity onPress={handleNextMonth}>
            <Text>{'>'}</Text>
          </TouchableOpacity>
        </View>
      );
    };
  
    const renderYearsDropdown = () => {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 100 }, (_, index) => currentYear - 50 + index);
  
      return (
        <View style={[styles.dropdownContainer, {width:'25%', zIndex:1}]}>
          <TouchableOpacity onPress={handlePrevYear}>
            <Text>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsYearDropdownVisible(!isYearDropdownVisible)}>
            <Text>{selectedYear}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextYear}>
            <Text>{'>'}</Text>
          </TouchableOpacity>
          {isYearDropdownVisible && (
            <ScrollView style={[styles.yearDropdown, {zIndex: 1}]}>
              {years.map((year) => (
                <TouchableOpacity key={year} onPress={() => handleYearSelect(year)}>
                  <Text>{year}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      );
    };

    const renderCalendar = () => {
        const currentMonth = moment(new Date(selectedYear, selectedMonth));
        const firstDayOfMonth = currentMonth.clone().startOf('month');
        const daysInMonth = currentMonth.daysInMonth();
        const startDay = firstDayOfMonth.clone().startOf('week');
        const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

        const calendarDays = [];
        let currentDay = startDay.clone();

        var offset:number = 0;
        while (currentDay.isBefore(endDay)) 
        {
            calendarDays.push(
                <TouchableOpacity
                    key={currentDay.toString()}
                    onPress={() => handleDaySelect(offset)}
                    style={[
                    styles.dayCell
                    ]}
                >
                    <Text>{parseInt(currentDay.format('D'),)}</Text>
                </TouchableOpacity>
            );

            currentDay.add(1, 'day');
            offset += 1;
        }
    
        const calendarDisplay = []
        for(var i = 0; i < calendarDays.length; i+=7)
        {
            calendarDisplay.push(
                <View key={`row${i/7}`} style={[{ height: 20, paddingTop: 40, justifyContent:'space-around', flexDirection:'row'}]}>
                    {calendarDays.slice(i,i+7)}
                </View>
            )
        }
    
        return calendarDisplay;
      };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleContainerClick}>
        <View style={styles.pickerContainer}>
            <Text style={{color:'gray'}}>4:00 PM EST</Text> 
        </View>
      </TouchableOpacity>
      {isSquareVisible && 
      <View style={[styles.square]}>
        <View style={{flexDirection:'row', zIndex:1}}>
            {renderMonthsDropdown()}
            {renderYearsDropdown()}
        </View>
        {renderCalendar()}
        </View>
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:1
  },
  square: {
    width: 400,
    height: 300,
    position:'absolute',
    backgroundColor: 'red',
    marginTop:350,
    marginRight:200,
    zIndex:1
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
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
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderColor: 'black',
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
    borderWidth: 1,
    borderColor: 'black',
  },
  disabledDay: {
    backgroundColor: '#ddd',
  },
  today: {
    backgroundColor: 'lightblue',
  },
});

export default TimeSelector;