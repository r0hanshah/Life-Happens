import React, { useEffect, useState } from 'react';
import { View, ViewStyle, useWindowDimensions, Text, TouchableHighlight, Animated, Touchable, TouchableOpacity } from 'react-native';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import TaskModel from '../../../models/TaskModel';
import { LinearGradient } from 'expo-linear-gradient';

import MainController from '../../../controllers/main/MainController';
import moment from 'moment';

interface DayNodeProps {
  dayNumber: number;
  dayOfWeek: number;
  leafTasks: TaskModel[];
  currentDay: boolean; 
  inMonth: boolean;
  lastRowExtension: number;
  scrollY: Animated.Value
}

const DayNode: React.FC<DayNodeProps> = ({ dayNumber, dayOfWeek, leafTasks, currentDay, inMonth, lastRowExtension, scrollY }) => {

  const controller = MainController.getInstance();

  const windowWidth = useWindowDimensions().width;
  const windowHeight = 180;

  let [fontsLoaded] = useFonts({
    Inter_500Medium
  });

  const [displayType, setDisplayType] = useState(0);

  const [scrollValue, setScrollValue] = useState(0);

  const [reRender, setReRender] = useState<boolean>(false)
  const [secondReender, setSecondRerender] = useState<boolean>(false)

  const [selectedTask, setSelectedTask] = useState<TaskModel>()

  const [displayGroups, setDisplayGroups] = useState<TaskModel[][]>([])
  const [idOfInterest, setIdOfInterest] = useState<string>("")

  useEffect(()=>{
    console.log("changed display groups")
  }, [secondReender])

  // Update based on edits made to a task
  useEffect(()=>{
    const taskListener = controller.getSelectedTask();

    const listener = (task: TaskModel | null) => {
      setSelectedTask(task ? task : undefined);
      console.log("change registered")
    };

    taskListener.addListener(listener)

    return () => {
      taskListener.removeListener(listener);
    };
  }, [controller])

  useEffect(() => {
      const listenerId = scrollY.addListener(({ value }) => {
      setScrollValue(value);
      });

      // Clean up the listener on component unmount
      return () => {
      scrollY.removeListener(listenerId);
      };
  }, [scrollY]);

  // Update display type
  useEffect(()=>{
    const displayListener = controller.getDisplay();

    const listener = (display: number) => {
      setDisplayType(display);
    };

    displayListener.addListener(listener)

    return () => {
      displayListener.removeListener(listener);
    };
  }, [controller])

  useEffect(()=>{
    const renderListener = controller.getReRender();

    const listener = (bool: boolean) => {
      setReRender(bool);
    };

    renderListener.addListener(listener)

    return () => {
      renderListener.removeListener(listener);
    };
  }, [controller])

  useEffect(()=>{
    let newDisplayGroups:TaskModel[][] = []

    leafTasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    // Create groups of overlap for each of the tasks in a day
    for(const task of leafTasks)
    {
      if(newDisplayGroups.length == 0)
      {
        newDisplayGroups.push([task])
      }
      else
      {
        const lastTaskRegistered = newDisplayGroups[newDisplayGroups.length-1][ newDisplayGroups[newDisplayGroups.length-1].length-1]
        if(lastTaskRegistered.startDate.getTime() <= task.startDate.getTime() && task.startDate.getTime() <= lastTaskRegistered.endDate.getTime())
        {
          if(task.id == idOfInterest)
          {
            newDisplayGroups[newDisplayGroups.length-1].unshift(task);
          }
          else
          {
            newDisplayGroups[newDisplayGroups.length-1].push(task);
          }
        }
        else
        {
          newDisplayGroups.push([task])
        }
      }
    }

    

    setDisplayGroups(newDisplayGroups);
  }, [leafTasks])

  const containerStyle:ViewStyle=
  {
    flexDirection: "row",
    backgroundColor: currentDay ? '#00488A' : '#383838',
    height: 40,
    width: windowWidth/7 * 0.7,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: "center",
    opacity: inMonth ? 1 : 0.5,
  }

  const weekContainerStyle:ViewStyle=
  {
    flexDirection: "column",
    backgroundColor: currentDay ? '#00488A' : '#383838',
    height: 875,
    width: windowWidth/7 * 0.75,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    opacity: inMonth ? 1 : 0.5,
  }

  const renderTaskCircles = () => 
  {
      const circles = []

      for(const task of leafTasks)
      {
        if(circles.length >= Math.ceil((windowWidth/7 - 100)/34)) {break}
        circles.push(
          <TouchableHighlight style={{width: 13, height: 13, borderRadius: 13,  marginLeft: 8}}  key={`leafTask${task.id}`} onPress={() => controller.setSelectedTask(task)}>
               <View style={{width: 13, height: 13, borderRadius: 13, backgroundColor: task.color}}/>
          </TouchableHighlight>
        )
      }

      const diff = leafTasks.length - circles.length

      return (
        <View style={{flexDirection: 'row', alignItems:'center'}}>
          {circles}
          {diff > 0 && 
          <View style={{width:25, height:25, borderRadius:20, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(0,0,0,0.2)', marginLeft:5}}>
            <Text style={{color:'white'}}>+{diff}</Text>
          </View>
          }
        </View>
      )
  }

  const renderWiresForDay = () => {
    const lines =[]
    for(const task of leafTasks)
    {
      if (lines.length >= 0 && lines.length < 3)
      lines.push(
      <>
        <View style={{position:'absolute', width:2, backgroundColor:task.color, height:5*leafTasks[0].offset * 4 + 10 + lastRowExtension, top: 40, alignSelf:'flex-start', left:50 + (20)* (lines.length)}}/>
        <View style={{position:'absolute', width:(windowWidth/7 - 50) - 40 * (lines.length+1 )+ (20)* (lines.length), backgroundColor:task.color, height:2, top: 40 + 5*leafTasks[0].offset * 4 + 10 + lastRowExtension, alignSelf:'flex-start', left:50 + (20)* (lines.length)}}/>
      </>
      )
    }
    return lines
  }

  const swap = (arr: any[], index1: number, index2: number) => {
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
    return arr;
  };

  const setDateToEndOfDay = (date: Date): Date => {
    const newDate = new Date(date)
    newDate.setHours(23, 59, 59, 999); // Set time to 11:59:59.999 PM
    return newDate;
  };

  const renderTaskCirclesForWeek = () => {
    const circles = []
    const currentDate = new Date()

    // Each group should have a double click functionality to where the task clicked is expanded and shows more details. Once expanded it can be clicked to display leaf task on the side.
    let displays =[]
    for(let j = 0; j < displayGroups.length; j++)
    {
      let displayGroup = displayGroups[j]
      for(let i = 0; i < displayGroup.length; i++)
      {
        let task = displayGroup[i]
        let weekDay = task.startDate.getDay()

        //Length of wires
        let heightFromStartDate = (-getMinutesDifference(setDateToEndOfDay(task.startDate), task.startDate))*0.527+150
        let heightFromEndOfCalendar = 153 + task.rootIndex*60

        if(i == 0)
        {
          let widthFromDay = task.isLeftBound() ? weekDay * (windowWidth/7 * 0.86) : (7 - weekDay) * (windowWidth/7 * 0.86)

          displays.push(
            <TouchableOpacity style={{ position:'absolute', left:-5, top:calculateMinutesSinceMidnight(task.startDate)*0.527+60, width: windowWidth/7 * 0.77 - 10 * displayGroup.length}} onPress={() => {
                controller.setSelectedTask(task);
                setSelectedTask(task);
              }}>

              <View style={{position:'absolute', top:3, left:-5}}>
                <View style={{backgroundColor:task.color, width:6, height:2, position:'absolute'}}/>
                <View style={{backgroundColor:task.color, width:2, height:heightFromStartDate, position:'absolute'}}/>
                <View style={[{backgroundColor:task.color, width: widthFromDay + (task.isLeftBound() && weekDay>0 ? 2 : 0) , top:heightFromStartDate, height:2, position:'absolute'}, task.isLeftBound() ? {left:-widthFromDay} : {}]}/>
                <View style={[{backgroundColor:task.color, width:2, top:heightFromStartDate, height: heightFromEndOfCalendar, position:'absolute'}, task.isLeftBound() ? {right: widthFromDay-2} : {left: widthFromDay}]}/>
                <View style={[{backgroundColor:task.color, width:30, top:heightFromStartDate + heightFromEndOfCalendar - 2, height: 2, position:'absolute'}, task.isLeftBound() ? {right:widthFromDay-30 } : {left: widthFromDay - 30}]}/>
              </View>

              <View style={{flexDirection:'column', height:getMinutesDifference(task.startDate, task.endDate)*0.527+10, width: windowWidth/7 * 0.77 - 10 * displayGroup.length}}>
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)']}              
                    style={{ flex: 1}}/>
                <View style={{position:'absolute', paddingLeft:15, top:-5}}>
                  <Text style={{color:'white'}}>{task.title}</Text>
                  {getMinutesDifference(task.startDate, task.endDate) >= 60 ? 
                  <Text style={{color:'#919191', fontSize:10}}>{formatTime(task.startDate)} - {formatTime(task.endDate)}</Text> : <></>}
                  {getMinutesDifference(task.startDate, task.endDate) >= 120 ? 
                  <Text style={{color:'#919191', fontSize:10}}>{getMinutesDifference(task.startDate, task.endDate)} minutes</Text> : <></>}
                </View>
                
              </View>
              
              <View style={{position:'absolute', left:5,width:2, height:getMinutesDifference(task.startDate, task.endDate)*0.527+10}}>
                <LinearGradient
                  colors={[task.color, 'rgba(0, 0, 0, 0)']}              
                  style={{ flex: 1}}/>
              </View>

              <View style={{position:'absolute', backgroundColor: task.color, height:10, width:10, borderRadius:10}}/>
              
            </TouchableOpacity>
          )
        }
        else
        {
          let widthFromDay = task.isLeftBound() ? (weekDay+1) * (windowWidth/7 * 0.86) : (6 - weekDay) * (windowWidth/7 * 0.86)
          let distanceFromCircle = 6 + 10*(i-1)

          displays.push(
            <TouchableOpacity style={{ position:'absolute', right:-5 + 10 * i, top:calculateMinutesSinceMidnight(task.startDate)*0.527+60, width:10, zIndex:-i}} onPress={() => {
                displayGroups[j] = swap(displayGroups[j], 0, i)
                setDisplayGroups(displayGroups)
                setSecondRerender(!secondReender)
                setIdOfInterest(task.id)
              }}>
                <View style={{position:'absolute', top:3, right:-5}}>
                  <View style={{backgroundColor:task.color, width:distanceFromCircle, height:2, position:'absolute'}}/>

                  <View style={{backgroundColor:task.color, width:2, height: heightFromStartDate, left:distanceFromCircle, position:'absolute'}}/>

                  <View style={[{backgroundColor:task.color, width:widthFromDay, top:heightFromStartDate, height:2, left:distanceFromCircle, position:'absolute'}, task.isLeftBound() ? {left:-widthFromDay + distanceFromCircle+2} : {}]}/>

                  <View style={[{backgroundColor:task.color, width:2, top:heightFromStartDate, height:heightFromEndOfCalendar, position:'absolute'}, task.isLeftBound() ? {right: -distanceFromCircle + widthFromDay-2} : {left: widthFromDay + distanceFromCircle}]}/>

                  <View style={[{backgroundColor:task.color, width:10 + (task.isLeftBound()? 6: 0), top:heightFromStartDate + heightFromEndOfCalendar - 2, height: 2, position:'absolute'}, task.isLeftBound() ? { right: -distanceFromCircle + widthFromDay-6-10} : {left: widthFromDay + distanceFromCircle-10}]}/>
                </View>

                <View style={{position:'absolute', right:-1,width:2, height:getMinutesDifference(task.startDate, task.endDate)*0.527+10}}>
                  <LinearGradient
                    colors={[task.color, 'rgba(0, 0, 0, 0)']}              
                    style={{ flex: 1}}/>
                </View>

                <View style={{position:'absolute', right:-5, backgroundColor: task.color, height:10, width:10, borderRadius:10}}/>
            </TouchableOpacity>
          )
          
        }
      }
    }

    return displays
  }

  const calculateMinutesSinceMidnight = (date:Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Convert hours to 12-hour format
    hours = hours % 24;

    // Calculate total minutes since 12:00 AM
    const totalMinutes = hours * 60 + minutes;

    return totalMinutes;
  };

  const getMinutesDifference = (d1:Date, d2:Date) => {
    const date1Moment = moment(d1);
    const date2Moment = moment(d2);
    const differenceInMinutes = date2Moment.diff(date1Moment, 'minutes');
    return differenceInMinutes;
  };

  const formatTime = (date:Date) => {
    const hours = (date.getHours()%12).toString();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderDayNode = () =>
  {
    if (controller.getDisplay().getValue() != 0)
    {
        return (
          <View style={weekContainerStyle}>
            {(scrollValue > 200 && scrollValue < 1000) ? 
            <View style={{position:'absolute', top: scrollValue-250, backgroundColor:'#151515', height: 120,
              width: windowWidth/7 * 0.75, paddingTop:80, zIndex: 999}}>
                <View style={{height:40, width: windowWidth/7 * 0.75 + 10, left:-5, bottom:0, borderTopLeftRadius:20, borderTopRightRadius:20, backgroundColor: currentDay ? '#00488A' : '#383838', flexDirection: "row", 
                  borderLeftWidth:5, borderLeftColor: '#151515',
                  borderRightWidth:5, borderRightColor:'#151515'
                  }}>
                  <Text style={{
                    color: '#fff',
                    paddingLeft: 15,
                    paddingTop:15,
                    fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial',
                    alignContent: "flex-start",
                    width: 35
                  }}>{dayNumber}</Text>
                </View>
            </View> 
            : <></>}
            <View style={{flexDirection: "row", maxWidth:'100%'}}>
              <Text style={{
                  color: '#fff',
                  paddingLeft: 15,
                  paddingTop:15,
                  fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial',
                  alignContent: "flex-start",
                  width: 35
                }}>{(scrollValue > 200) ? '' : dayNumber}</Text>
            </View>
            {renderTaskCirclesForWeek()}
          </View>
        )
    }
    else
    {
      return (
        <View style={{flexDirection:"column", alignItems:"center"}}>
          <View style={{flexDirection: "row"}}>
            <View style={{flexDirection: "column", height: "auto", justifyContent:"center"}}>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 8 ? leafTasks[8].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 7 ? leafTasks[7].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 6 ? leafTasks[6].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
            </View>
            <View style={containerStyle}>
              <Text style={{
                color: '#fff',
                paddingLeft: 15,
                fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial',
                alignContent: "flex-start",
                width: 35
              }}>{dayNumber}</Text>
              {/* Render task circles */}
              {renderTaskCircles()}
              {/* {renderWiresForDay()} */}
            </View>
            <View style={{flexDirection: "column", height: "auto", justifyContent:"center"}}>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 5 ? leafTasks[5].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 4 ? leafTasks[4].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 3 ? leafTasks[3].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
            </View>
          </View>
          <View style={{flexDirection: "row", justifyContent: "flex-start", width: "100%"}}>
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3, marginLeft: windowWidth * 0.04}}/>
            <View style={{width: 2, height: leafTasks.length > 0 ? windowHeight*0.057 + leafTasks[0].offset * 4 + 1 + lastRowExtension : 33, backgroundColor:leafTasks.length > 0 ? leafTasks[0].color : "rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0)", marginRight: 8}}/>
  
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: leafTasks.length > 1 ? windowHeight*0.057 + leafTasks[1].offset * 4 + 1 + lastRowExtension : 33, backgroundColor:leafTasks.length > 1 ? leafTasks[1].color : "rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0)", marginRight: 8}}/>
  
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: leafTasks.length > 2 ? windowHeight*0.057 + leafTasks[2].offset * 4 + 1 + lastRowExtension : 33, backgroundColor:leafTasks.length > 2 ? leafTasks[2].color : "rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
          </View>
        </View>
      )
    }
  }

  return( 
    renderDayNode()
  );
};

export default DayNode;