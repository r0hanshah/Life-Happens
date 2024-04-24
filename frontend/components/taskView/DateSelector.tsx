import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ScrollView, Dimensions, Image  } from 'react-native';
import TaskModel from '../../models/TaskModel';
import moment from 'moment';
import MainController from '../../controllers/main/MainController';


const DateSelector = ({task, modStartDate, updateFunctions} : {task:TaskModel, modStartDate:boolean, updateFunctions:Array<(duration:string)=>void>}) => {

    const [isSquareVisible, setIsSquareVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(modStartDate ? task.startDate.getMonth() : task.endDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(modStartDate ? task.startDate.getFullYear() : task.endDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(modStartDate ? task.startDate : task.endDate)
    const [isYearDropdownVisible, setIsYearDropdownVisible] = useState(false);

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = daysOfWeek[(modStartDate ? task.startDate : task.endDate).getDay()];
    const monthName = months[(modStartDate ? task.startDate : task.endDate).getMonth()];
    const dayOfMonth = (modStartDate ? task.startDate : task.endDate).getDate();
    const year = (modStartDate ? task.startDate : task.endDate).getFullYear();
    
    const [formattedDate, setFormattedDate] = useState(`${dayOfWeek}, ${monthName} ${dayOfMonth}, ${year}`);

    useEffect(()=>{
      setSelectedMonth(modStartDate ? task.startDate.getMonth() : task.endDate.getMonth());
      setSelectedYear(modStartDate ? task.startDate.getFullYear() : task.endDate.getFullYear());
      setSelectedDate(modStartDate ? task.startDate : task.endDate)
      const dayOfWeek = daysOfWeek[(modStartDate ? task.startDate : task.endDate).getDay()];
      const monthName = months[(modStartDate ? task.startDate : task.endDate).getMonth()];
      const dayOfMonth = (modStartDate ? task.startDate : task.endDate).getDate();
      const yearOfDay = (modStartDate ? task.startDate : task.endDate).getFullYear();
      const formattedDate = `${dayOfWeek}, ${monthName} ${dayOfMonth}, ${yearOfDay}`;
      setFormattedDate(formattedDate);
      for(const parent of task.ancestors)
      {
        if(modStartDate ? parent.endDate < task.endDate : parent.startDate > task.startDate)
          if(modStartDate) { parent.startDate = task.startDate }
          else { parent.endDate = task.endDate}
         
      }
      updateFunctions.at(0)!(calculateDuration(task.startDate, task.endDate))
      updateFunctions.at(1)!(calculateDuration(new Date(), task.endDate))
    }, [task, task.endDate, task.startDate])
  
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

    const handleDaySelect = (year:number , month:number, day:number|"") => {
   
      if (typeof day === 'number')
      {
        const date = new Date(year, month-1, day)
        setSelectedDate(date)

        if (modStartDate)
        {
          const diff = task.endDate.getTime() - task.startDate.getTime()
          task.endDate = new Date(date.getTime() + diff)
        }

        const dayOfWeek = daysOfWeek[date.getDay()];
        const monthName = months[date.getMonth()];
        const dayOfMonth = date.getDate();
        const yearOfDay = date.getFullYear();

        // Format the date string
        const formattedDate = `${dayOfWeek}, ${monthName} ${dayOfMonth}, ${yearOfDay}`;
        setFormattedDate(formattedDate);

        // Update task date
        (modStartDate ? task.startDate : task.endDate).setFullYear(year);
        (modStartDate ? task.startDate : task.endDate).setMonth(month-1);
        (modStartDate ? task.startDate : task.endDate).setDate(day);

        updateFunctions.at(0)!(calculateDuration(task.startDate, task.endDate))
        updateFunctions.at(1)!(calculateDuration(new Date(), task.endDate))

        // Refresh main view
        const mainController = MainController.getInstance();
        mainController.setReRender(mainController.getReRender().getValue() ? false : true)
      }
     
    }
  
    const renderMonthsDropdown = () => {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
  
      return (
        <View style={[styles.dropdownContainer, {width:'50%'}]}>
          <TouchableOpacity onPress={handlePrevMonth}>
              <Image source={require('../../assets/chev_white.png')} style={{width:15, height:10, transform:[{rotate: '90deg'}]}}></Image>
          </TouchableOpacity>
          <Text style={{color:'white'}}>{months[selectedMonth]}</Text>
          <TouchableOpacity onPress={handleNextMonth}>
              <Image source={require('../../assets/chev_white.png')} style={{width:15, height:10, transform:[{rotate: '-90deg'}]}}></Image>
          </TouchableOpacity>
        </View>
      );
    };

    const scrollViewRef = useRef<ScrollView>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);

    useEffect(() => {
      if (scrollViewRef.current) {
        const { height: screenHeight } = Dimensions.get('window');
        const middleY = (contentHeight - screenHeight) / 2;
        scrollViewRef.current.scrollTo({ y: middleY + 350, animated: true });
      }
    }, [contentHeight]);

    const onContentSizeChange = (width: number, height: number) => {
      setContentHeight(height);
    };
  
    const renderYearsDropdown = () => {
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 100 }, (_, index) => currentYear - 50 + index);
  
      return (
        <View style={[styles.dropdownContainer, {width:'25%', zIndex:1}]}>
          <TouchableOpacity onPress={handlePrevYear}>
          <Image source={require('../../assets/chev_white.png')} style={{width:15, height:10, transform:[{rotate: '90deg'}]}}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsYearDropdownVisible(!isYearDropdownVisible)}>
            <Text style={{color:'white'}}>{selectedYear}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextYear}>
          <Image source={require('../../assets/chev_white.png')} style={{width:15, height:10, transform:[{rotate: '-90deg'}]}}></Image>
          </TouchableOpacity>
          {isYearDropdownVisible && (
            <ScrollView 
            ref={scrollViewRef}
            onContentSizeChange={onContentSizeChange}
            style={[styles.yearDropdown, {zIndex: 1}]}>
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
        const currentDate = moment(new Date());

        const selectedDay = moment(selectedDate)
        const otherDay = moment(!modStartDate ? task.startDate : task.endDate)


        const firstDayOfMonth = currentMonth.clone().startOf('month');
        const daysInMonth = currentMonth.daysInMonth();
        const startDay = firstDayOfMonth.clone().startOf('week');
        const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

        const calendarDays = [];
        let currentDay = startDay.clone();

        var offset:number = 0;
        while (currentDay.isBefore(endDay)) 
        {
          const day = parseInt(currentDay.format('D'),);
          const month = parseInt(currentDay.format('M'),);
          const year = parseInt(currentDay.format('YYYY'),);
            calendarDays.push(
                <TouchableOpacity
                    key={currentDay.toString()}
                    onPress={() => { handleDaySelect(year, month, day)}}
                    style={[
                    styles.dayCell,
                    {backgroundColor: (selectedDay.year() == currentDay.year() && selectedDay.month() == currentDay.month() && selectedDay.date() == currentDay.date())? '#D35454' :
                    (otherDay.year() == currentDay.year() && otherDay.month() == currentDay.month() && otherDay.date() == currentDay.date()) ? '#783333' :
                    (currentDate.year() == currentDay.year() && currentDate.month() == currentDay.month() && currentDate.date() == currentDay.date()) ? '#00488A' : 'clear'},
                    ]}
                >
                    <Text style={{color: currentDay.month() == firstDayOfMonth.month() ? 'white' : 'gray'}}>{parseInt(currentDay.format('D'),)}</Text>
                </TouchableOpacity>
            );

            currentDay.add(1, 'day');
            offset += 1;
        }
    
        const calendarDisplay = []
        for(var i = 0; i < calendarDays.length; i+=7)
        {
            calendarDisplay.push(
                <View key={`row${i/7}`} style={[{ height: 20, marginTop:20, flexDirection:'row'}]}>
                    {calendarDays.slice(i,i+7)}
                </View>
            )
        }
    
        return calendarDisplay;
      };
    

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{alignItems:'flex-end'}} onPress={handleContainerClick}>
        <View style={[styles.pickerContainer, {alignItems:'flex-end'}]}>
            <Text style={{color:'gray'}}>{formattedDate}</Text> 
        </View>
      </TouchableOpacity>
      {isSquareVisible && 
        <View style={[styles.square]}>
          <View style={{flexDirection:'row', zIndex:1}}>
              {renderMonthsDropdown()}
              {renderYearsDropdown()}
          </View>
          {renderCalendar()}
          <View style={{flexDirection:'row', justifyContent:'space-around', paddingTop:30, width:'80%'}}>
            <Text style={{color:'gray'}}>Su</Text>
            <Text style={{color:'gray'}}>M</Text>
            <Text style={{color:'gray'}}>T</Text>
            <Text style={{color:'gray'}}>W</Text>
            <Text style={{color:'gray'}}>Th</Text>
            <Text style={{color:'gray'}}>F</Text>
            <Text style={{color:'gray'}}>S</Text>
          </View>
        </View>
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  pickerContainer: {
    width:200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:1
  },
  square: {
    width: 350,
    height: 350,
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
});

export default DateSelector;