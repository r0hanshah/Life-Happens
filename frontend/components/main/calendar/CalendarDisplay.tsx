import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import DayNode from './DayNode';
import moment from 'moment';

interface CalendarProps {
  offset: number;
  parentNodes: string[]; // row,column,color
}

const CalendarDisplay: React.FC<CalendarProps> = ({ offset, parentNodes }) => {

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const [currentMonth, setCurrentMonth] = useState(moment());

  useEffect(() => {
    // Fetch or set the initial month based on your requirements
    // For example, you can set it to the current month
    setCurrentMonth(moment());
  }, []);

  const renderCalendar = () => {
    const firstDayOfMonth = currentMonth.clone().startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = firstDayOfMonth.clone().startOf('week');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

    const calendarDays = [];
    let currentDay = startDay.clone();

    while (currentDay.isBefore(endDay)) {

        calendarDays.push(
            <DayNode key={currentDay.toString()} dayNumber={parseInt(currentDay.format('D'),)} dayOfWeek={0} currentDay={currentDay.year() == currentMonth.year() && currentDay.month() == currentMonth.month() && currentDay.toDate().getDate() == currentMonth.toDate().getDate()} leafTasks={[]} inMonth={ currentDay.month() == currentMonth.month()}/>
        );

        currentDay.add(1, 'day');
    }

    const calendarDisplay = []
    for(var i = 0; i < calendarDays.length; i+=7)
    {
        calendarDisplay.push(
            <View key={`row${i/7}`} style={[styles.row, { height: ((windowHeight / 6) * 0.9), paddingTop: windowHeight / 6 * 0.4}]}>
                {calendarDays.slice(i,i+7)}
            </View>
        )
    }

    return calendarDisplay;
  };


  return (
    <View style={[styles.grid, { width: windowWidth * 0.84}]}>
      {renderCalendar()}
      <View style={[styles.row, { height: 40}]}>
        <Text style={{color:'#717171'}}>Su</Text>
        <Text style={{color:'#717171'}}>M</Text>
        <Text style={{color:'#717171'}}>T</Text>
        <Text style={{color:'#717171'}}>W</Text>
        <Text style={{color:'#717171'}}>Th</Text>
        <Text style={{color:'#717171'}}>F</Text>
        <Text style={{color:'#717171'}}>S</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    position: 'absolute',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
});

export default CalendarDisplay;