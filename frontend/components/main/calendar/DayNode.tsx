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
  dayMoment: moment.Moment
}

const DayNode: React.FC<DayNodeProps> = ({ dayNumber, dayOfWeek, leafTasks, currentDay, inMonth, lastRowExtension, scrollY, dayMoment }) => {

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
        let heightFromStartDate = (-getMinutesDifference(setDateToEndOfDay(task.startDate), task.startDate))*0.547 +132
        let heightFromEndOfCalendar = 158 + task.rootIndex*60

        if(i == 0)
        {
          let widthFromDay = task.isLeftBound() ? weekDay * (windowWidth/7 * 0.86) : (7 - weekDay) * (windowWidth/7 * 0.86)

          displays.push(
            <TouchableOpacity style={{ position:'absolute', left:-5, top:calculateMinutesSinceMidnight(task.startDate)*0.547 + 45, width: windowWidth/7 * 0.77 - 10 * displayGroup.length}} onPress={() => {
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

              <View style={{flexDirection:'column', height:getMinutesDifference(task.startDate, task.endDate)*0.547, width: windowWidth/7 * 0.77 - 10 * displayGroup.length}}>
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
              
              <View style={{position:'absolute', left:5,width:2, height:getMinutesDifference(task.startDate, task.endDate)*0.547}}>
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
            <TouchableOpacity style={{ position:'absolute', right:-5 + 10 * i, top:calculateMinutesSinceMidnight(task.startDate)*0.547 + 45, width:10, zIndex:-i}} onPress={() => {
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

                <View style={{position:'absolute', right:-1,width:2, height:getMinutesDifference(task.startDate, task.endDate)*0.547}}>
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

  const renderHorizontalWire = (displayGroup: TaskModel[], i:number) => {
    let wires = []
    let task = displayGroup[i]

    let changeHeight = true
    let startedIter = true

    const start_i = i
    const width = ((windowWidth * 0.77 - 10) / displayGroup.length)
    const index_offset =   i > 0 ? 8 + i*3 : 0

    let yDiffFromLeftNeighbour = (i > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) * 0.547 : 0 : 0) + 8 + i*3
    let xDiffFromLeftNeighbour = ((windowWidth * 0.77 - 10) / displayGroup.length)

    while(i > 0)
    {
      let time_diff = (i > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) * 0.547 : 0 : 0)
      wires.push(
        <>
        { changeHeight &&
            <View style={{backgroundColor:task.color, top: -(yDiffFromLeftNeighbour),  width:2, height:time_diff + (startedIter ? index_offset : 0), left: -(width)*(start_i-i),  position:'absolute', zIndex: task === controller.getSelectedTask().getValue() ? 999 : 0}}/>
        }
          
          <View style={{backgroundColor:task.color, top: -(yDiffFromLeftNeighbour), left: -(width)*(start_i-i+1) ,  width: width, height:2, position:'absolute', zIndex: task === controller.getSelectedTask().getValue() ? 999 : 0}}/>
        </>
      )

      i-=1

      var prev_yDiff = yDiffFromLeftNeighbour
      var new_yDiff = (i > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) * 0.547 : 0 : 0)

      yDiffFromLeftNeighbour += new_yDiff
      
      if (new_yDiff != prev_yDiff && new_yDiff > 0)
      {
        changeHeight = true
      }
      else
      {
        changeHeight = false
      }

      xDiffFromLeftNeighbour += xDiffFromLeftNeighbour
      startedIter = false
    }

    let heightFromEndOfCalendar = 239.5 + displayGroup[start_i].rootIndex*60
    let vertical_length = calculateMinutesTillMidnight(task.startDate)*0.547 + yDiffFromLeftNeighbour + (start_i > 0 ? 8 : 0) + heightFromEndOfCalendar
    console.log(heightFromEndOfCalendar, vertical_length, calculateMinutesTillMidnight(task.startDate)*0.547, yDiffFromLeftNeighbour)

    wires.push(
      <>
        <View style={{backgroundColor:task.color, width:start_i*3,top: start_i == 0 ? 0 : -yDiffFromLeftNeighbour,  height: 2, left:-(width*start_i) - (start_i*3), position:'absolute'}}/>
        <View style={{backgroundColor:task.color, width:2,top: start_i == 0 ? 0 : -yDiffFromLeftNeighbour,  height: vertical_length, left:-(width*start_i) - (start_i*3), position:'absolute'}}/>
        <View style={{backgroundColor:task.color, width:start_i*10 + 30,top: vertical_length - (start_i > 0 ? yDiffFromLeftNeighbour : 0),  height: 2, left:-(width*start_i) - (start_i*3), position:'absolute'}}/>
      </>
    )

    return wires
  }

  const renderTaskCirclesForDay = () => {
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
        let heightFromStartDate = (-getMinutesDifference(setDateToEndOfDay(task.startDate), task.startDate))*0.547 +132
        let heightFromEndOfCalendar = 220 + task.rootIndex*60

        if(true) // Figure out how many days in day groups to change
        {
          let widthFromDay = task.isLeftBound() ? weekDay * (windowWidth/7 * 0.86) : (7 - weekDay) * (windowWidth/7 * 0.86)
          console.log("Difference between tasks in groups: ", i > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) : 0)
          let yDiffFromLeftNeighbour = i > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) > 0 ? getMinutesDifference(displayGroup[i-1].startDate, displayGroup[i].startDate) * 0.547 : 0 : 0

          displays.push(
            <TouchableOpacity style={{ position:'absolute', left:-5 + ((windowWidth * 0.77 - 10) / displayGroup.length)*(i), top:calculateMinutesSinceMidnight(task.startDate)*0.547 + 45, width: (windowWidth * 0.77 - 10) / displayGroup.length}} onPress={() => {
                controller.setSelectedTask(task);
                setSelectedTask(task);
              }}>

              <View style={{position:'absolute', top:3, left:-5}}>
                <View style={{backgroundColor:task.color, width:6, height:2, position:'absolute'}}/>
                {renderHorizontalWire(displayGroup, i)}
                
              </View>

              <View style={{flexDirection:'column', height:getMinutesDifference(task.startDate, task.endDate)*0.547, width: (windowWidth * 0.77 - 10) / displayGroup.length-5}}>
                <LinearGradient
                    colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.1)']}              
                    style={{ flex: 1, left: 5}}/>
                <View style={{position:'absolute', paddingLeft:15, top:-5}}>
                  <Text style={{color:'white'}}>{task.title}</Text>
                  {getMinutesDifference(task.startDate, task.endDate) >= 59 ? 
                  <Text style={{color:'#919191', fontSize:10}}>{formatTime(task.startDate)} - {formatTime(task.endDate)}</Text> : <></>}
                  {getMinutesDifference(task.startDate, task.endDate) >= 118 ? 
                  <Text style={{color:'#919191', fontSize:10}}>{getMinutesDifference(task.startDate, task.endDate)} minutes</Text> : <></>}
                </View>
                
              </View>
              
              <View style={{position:'absolute', left:5,width:2, height:getMinutesDifference(task.startDate, task.endDate)*0.547}}>
                <LinearGradient
                  colors={[task.color, 'rgba(0, 0, 0, 0)']}              
                  style={{ flex: 1}}/>
              </View>

              <View style={{position:'absolute', backgroundColor: task.color, height:10, width:10, borderRadius:10}}/>
              
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

  const calculateMinutesTillMidnight = (date:Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    console.log(hours, minutes)

    // Calculate total minutes since 12:00 AM
    const totalMinutes = 24 * 60 - (hours*60 + minutes);

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

  const dayPressed = () => {
    console.log("Moment of Day pressed: ", dayMoment)
    controller.setMoment(dayMoment)
    controller.setDisplay(2)
  }

  const renderDayNode = () =>
  {
    if (controller.getDisplay().getValue() == 1)
    {
        return (
          <TouchableOpacity onPress={dayPressed} style={weekContainerStyle}>
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
                <View style={{width:'120%',top:0, height:'100%', position:'absolute', backgroundColor:'#151515', alignSelf:'center', zIndex:-999}}/>
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
          </TouchableOpacity>
        )
    }
    else if (controller.getDisplay().getValue() == 0)
    {
      return (
        <TouchableOpacity onPress={dayPressed} style={{flexDirection:"column", alignItems:"center"}}>
          <View style={{flexDirection: "row"}}>
            <View style={{flexDirection: "column", height: "auto", justifyContent:"center"}}>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:"rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:"rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:"rgba(255,255,255,0)", marginBottom: 3}}/>
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
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:"rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:"rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:"rgba(255,255,255,0)", marginBottom: 3}}/>
            </View>
          </View>
          <View style={{flexDirection: "row", justifyContent: "flex-start", width: "100%"}}>
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3, marginLeft: windowWidth * 0.04}}/>
            <View style={{width: 2, height: leafTasks.length > 0 ? windowHeight*0.057 + leafTasks[0].offset * 4 + 2 + lastRowExtension : 33, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0)", marginRight: 8}}/>
  
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: leafTasks.length > 1 ? windowHeight*0.057 + leafTasks[1].offset * 4 + 2 + lastRowExtension : 33, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0)", marginRight: 8}}/>
  
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: leafTasks.length > 2 ? windowHeight*0.057 + leafTasks[2].offset * 4 + 2 + lastRowExtension : 33, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
          </View>
        </TouchableOpacity>
      )
    }
    else
    {
      return (
        <View style={[weekContainerStyle, {width:windowWidth*0.80}]}>
          {(scrollValue > 200 && scrollValue < 1000) ? 
          <View style={{position:'absolute', top: scrollValue-250, backgroundColor:'#151515', height: 120,
            width: windowWidth * 0.8, paddingTop:80, zIndex: 999}}>
              <View style={{height:40, width: windowWidth * 0.8 + 10, left:-5, bottom:0, borderTopLeftRadius:20, borderTopRightRadius:20, backgroundColor: currentDay ? '#00488A' : '#383838', flexDirection: "row", 
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
              <View style={{width:'105%',top:0, height:'100%', position:'absolute', backgroundColor:'#151515', alignSelf:'center', zIndex:-999}}/>
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
          {renderTaskCirclesForDay()}
        </View>
      )
    }
  }

  return( 
    renderDayNode()
  );
};

export default DayNode;