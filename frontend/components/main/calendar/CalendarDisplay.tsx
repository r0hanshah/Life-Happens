import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import DayNode from './DayNode';

interface CalendarProps {
  offset: number;
  parentNodes: string[]; // row,column,color
}

const CalendarDisplay: React.FC<CalendarProps> = ({ offset, parentNodes }) => {

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  return (
    <View style={[styles.grid, { width: windowWidth * 0.84}]}>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9), paddingTop: '2%'}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9), paddingTop: '2%'}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9), paddingTop: '2%'}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9), paddingTop: '2%'}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9), paddingTop: '2%'}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      {/* Display only when the calendar is not big enough to fit all days */}
      {/* <View style={[styles.row, { height: ((windowHeight / 6) * 0.9), paddingTop: '2%'}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View> */}
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