import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import moment from 'moment';
import DayNode from './DayNode';

interface CalendarProps {}

const CalendarComponent: React.FC<CalendarProps> = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

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
            <View key={`row${i/7}`} style={[styles.row, { height: ((windowHeight / 6) * 0.9), paddingTop: '2%'}]}>
                {calendarDays.slice(i,i+7)}
            </View>
        )
    }

    return calendarDisplay;
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      {/* Render the header with day names */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {moment.weekdaysShort().map(day => (
          <Text key={day}>{day}</Text>
        ))}
      </View>
      {/* Render the calendar grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{renderCalendar()}</View>
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

export default CalendarComponent;
