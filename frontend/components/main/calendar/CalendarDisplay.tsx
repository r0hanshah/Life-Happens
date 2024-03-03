import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import DayNode from './DayNode';

interface CalendarProps {
  offset: number;
  parentNodes: string[]; // row,column,color
}

const CalendarDisplay: React.FC<CalendarProps> = ({ offset, parentNodes }) => {

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  return (
    <View style={[styles.grid, {marginTop: -110, width: windowWidth * 0.84}]}>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
        <DayNode dayNumber={1} dayOfWeek={0} currentDay={false} leafTasks={[]} />
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
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
});

export default CalendarDisplay;