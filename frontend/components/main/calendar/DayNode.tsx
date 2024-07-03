import React, { useEffect, useState } from 'react';
import { View, ViewStyle, useWindowDimensions, Text, TouchableHighlight, Animated } from 'react-native';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import TaskModel from '../../../models/TaskModel';

import MainController from '../../../controllers/main/MainController';

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
        circles.push(
          <TouchableHighlight style={{width: 13, height: 13, borderRadius: 13,  marginLeft: 8}}  key={`leafTask${task.id}`} onPress={() => controller.setSelectedTask(task)}>
               <View style={{width: 13, height: 13, borderRadius: 13, backgroundColor: task.color}}/>
          </TouchableHighlight>
        )
        if(circles.length > 4) {break}
      }

      return (
        <View style={{flexDirection: 'row'}}>
          {circles}
        </View>
      )
  }

  const renderDayNode = () =>
  {
    if (controller.getDisplay().getValue() != 0)
    {
        return (
          <View style={weekContainerStyle}>
            
            <View style={{flexDirection: "row", maxWidth:'100%'}}>
              <Text style={{
                  color: '#fff',
                  paddingLeft: 15,
                  paddingTop:15,
                  fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial',
                  alignContent: "flex-start",
                  width: 35
                }}>{dayNumber}</Text>
              <Text>Scroll Value: {scrollValue}</Text>
            </View>
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
            </View>
            <View style={{flexDirection: "column", height: "auto", justifyContent:"center"}}>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 5 ? leafTasks[5].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 4 ? leafTasks[4].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
              <View style={{width: windowWidth * 0.01, height: 2, backgroundColor:leafTasks.length > 3 ? leafTasks[3].color : "rgba(255,255,255,0)", marginBottom: 3}}/>
            </View>
          </View>
          <View style={{flexDirection: "row", justifyContent: "flex-start", width: "100%"}}>
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3, marginLeft: windowWidth * 0.04}}/>
            <View style={{width: 2, height: leafTasks.length > 0 ? windowHeight*0.043 + leafTasks[0].offset * 4 + 1 + lastRowExtension : 33, backgroundColor:leafTasks.length > 0 ? leafTasks[0].color : "rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0)", marginRight: 8}}/>
  
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: leafTasks.length > 1 ? windowHeight*0.043 + leafTasks[1].offset * 4 + 1 + lastRowExtension : 33, backgroundColor:leafTasks.length > 1 ? leafTasks[1].color : "rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0)", marginRight: 8}}/>
  
            <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0)", marginRight: 3}}/>
            <View style={{width: 2, height: leafTasks.length > 2 ? windowHeight*0.043 + leafTasks[2].offset * 4 + 1 + lastRowExtension : 33, backgroundColor:leafTasks.length > 2 ? leafTasks[2].color : "rgba(255,255,255,0)", marginRight: 3}}/>
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