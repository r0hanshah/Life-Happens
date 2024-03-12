import React from 'react';
import { View, ViewStyle, useWindowDimensions, Text } from 'react-native';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import TaskModel from '../../../models/TaskModel';

interface DayNodeProps {
  dayNumber: number;
  dayOfWeek: number;
  leafTasks: TaskModel[];
  currentDay: boolean; 
  inMonth: boolean;
}

const DayNode: React.FC<DayNodeProps> = ({ dayNumber, dayOfWeek, leafTasks, currentDay, inMonth }) => {

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  let [fontsLoaded] = useFonts({
    Inter_500Medium
  });

  const containerStyle:ViewStyle=
  {
    flexDirection: "row",
    backgroundColor: currentDay ? '#00488A' : '#383838',
    height: windowHeight/6 * 0.35,
    maxHeight: 50,
    width: windowWidth/7 * 0.7,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: "center",
    opacity: inMonth ? 1 : 0.5,
  }

  const renderTaskCircles = () => 
  {
      const circles = []

      for(const task of leafTasks)
      {
        circles.push(
          <View key={`leafTask${task.id}`} style={{width: 13, height: 13, borderRadius: 13, backgroundColor: task.color, marginLeft: 8}}/>
        )
      }

      return (
        <View style={{flexDirection: 'row'}}>
          {circles}
        </View>
      )
  }

  const renderDayNode = () =>
  {
    return (
      <View style={{flexDirection:"column", alignItems:"center"}}>
        <View style={{flexDirection: "row"}}>
          <View style={{flexDirection: "column", height: "auto", justifyContent:"center"}}>
            <View style={{width: 15, height: 2, backgroundColor:"rgba(255,255,255,0.1)", marginBottom: 3}}/>
            <View style={{width: 15, height: 2, backgroundColor:"rgba(255,255,255,0.1)", marginBottom: 3}}/>
            <View style={{width: 15, height: 2, backgroundColor:"rgba(255,255,255,0.1)", marginBottom: 3}}/>
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
            <View style={{width: 15, height: 2, backgroundColor:"rgba(255,255,255,0.1)", marginBottom: 3}}/>
            <View style={{width: 15, height: 2, backgroundColor:"rgba(255,255,255,0.1)", marginBottom: 3}}/>
            <View style={{width: 15, height: 2, backgroundColor:"rgba(255,255,255,0.1)", marginBottom: 3}}/>
          </View>
        </View>
        <View style={{flexDirection: "row", justifyContent: "flex-start", width: "100%"}}>
          <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 3, marginLeft: 60}}/>
          <View style={{width: 2, height: 33, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 3}}/>
          <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 8}}/>

          <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 3}}/>
          <View style={{width: 2, height: 33, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 3}}/>
          <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 8}}/>

          <View style={{width: 2, height: 30, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 3}}/>
          <View style={{width: 2, height: 33, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 3}}/>
          <View style={{width: 2, height: 37, backgroundColor:"rgba(255,255,255,0.1)", marginRight: 3}}/>
        </View>
      </View>
    )
  }

  return( 
    renderDayNode()
  );
};

export default DayNode;