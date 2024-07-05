import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions, TouchableOpacity, Modal, Button, Animated } from 'react-native';
import DayNode from './DayNode';
import moment from 'moment';
import TaskModel from '../../../models/TaskModel';
import MainController from '../../../controllers/main/MainController';
import WeekDisplay from './WeekDisplay';

interface CalendarProps {
  offset: number;
  leafNodesMap: { [key:number] : TaskModel[]}; // row,column,color
  inMoment: moment.Moment;
  scrollY: Animated.Value
}

const CalendarDisplay: React.FC<CalendarProps> = ({ offset, leafNodesMap, inMoment, scrollY }) => {

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const [currentMonth, setCurrentMonth] = useState(inMoment);

  const [weekDays, setWeekDays] = useState<React.JSX.Element[]>([]);

  // Produce map of yyyymmdd (string) : [TaskModel[]]

  useEffect(() => {
    // Fetch or set the initial month based on your requirements
    // For example, you can set it to the current month
    setCurrentMonth(moment(inMoment));
    const mainController = MainController.getInstance()
    const reRenderState = mainController.getReRender().getValue()
    mainController.setReRender(reRenderState ? false : true)

    //Update weeks
    console.log("Week Moment", inMoment)
    const indexingMoment=inMoment.clone()
    const weekDays:React.JSX.Element[] = [];
    const currentDate = moment(new Date())

    for(let i =0; i < 7; i++)
    {
      weekDays.push(
          <DayNode key={indexingMoment.toString()} dayNumber={parseInt(indexingMoment.format('D'),)} dayOfWeek={0} currentDay={currentDate.year() == indexingMoment.year() && currentDate.month() == inMoment.month() && currentDate.date() == indexingMoment.date()} leafTasks={leafNodesMap.hasOwnProperty(offset) ? leafNodesMap[offset] : []} inMonth={ indexingMoment.month() == currentMonth.month()} lastRowExtension={0} scrollY={scrollY}/>
      );

      indexingMoment.subtract(1,'day')
    }

    setWeekDays(weekDays.toReversed())
  }, [inMoment]);

  const renderCalendar = () => {
    const firstDayOfMonth = currentMonth.clone().startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = firstDayOfMonth.clone().startOf('week');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');
    const currentDate = moment(new Date())

    const difference = endDay.diff(startDay, 'days')
    const calendarDays:React.JSX.Element[] = [];
    let currentDay = startDay.clone();

    var offset:number = 0;
    while (currentDay.isBefore(endDay)) 
    {
        calendarDays.push(
            <DayNode key={currentDay.toString()} dayNumber={parseInt(currentDay.format('D'),)} dayOfWeek={0} currentDay={currentDate.year() == currentDay.year() && currentDate.month() == currentDay.month() && currentDate.date() == currentDay.date()} leafTasks={leafNodesMap.hasOwnProperty(offset) ? leafNodesMap[offset] : []} inMonth={ currentDay.month() == currentMonth.month()} lastRowExtension={difference - offset < 7 ? 128 : 0} scrollY={scrollY}/>
        );

        currentDay.add(1, 'day');
        offset += 1;
    }

    const calendarDisplay = []
    for(let i = 0; i < calendarDays.length; i+=7)
    {
        calendarDisplay.push(
            <View key={`row${i/7}`} style={[styles.row, { height: 95, paddingTop: 40}]}>
                {calendarDays.slice(i,i+7)}
                <TouchableOpacity onPress={() => {
                  setWeekDays(calendarDays.slice(i,i+7))
                  MainController.getInstance().setDisplay(1)
                  MainController.getInstance().setMoment(startDay.clone().add(i+7-1, 'days'))
                  }}>
                  <View style={{position: 'absolute', width:10, height:10, borderRadius: 10, backgroundColor:'#717171', right:-20, marginVertical:15}}></View>
                </TouchableOpacity>
            </View>
        )
    }

    return calendarDisplay;
  };

  return (
    <View style={[styles.grid, { width: windowWidth * 0.84}]}>
      {MainController.getInstance().getDisplay().getValue() == 1 ? <WeekDisplay dayNodes={weekDays} scrollY={scrollY}/> :  renderCalendar() }

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
    // position: 'absolute',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
});

export default CalendarDisplay;