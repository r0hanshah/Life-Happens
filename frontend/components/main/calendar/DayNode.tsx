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
    backgroundColor: currentDay ? '#00488A' : '#383838',
    height: windowHeight/6 * 0.35,
    maxHeight: 50,
    width: windowWidth/7 * 0.7,
    borderRadius: 20,
    justifyContent: 'flex-start',
    opacity: inMonth ? 1 : 0.5,
  }

  return( 
    <View style={containerStyle}>
      <Text style={{
        color: '#fff',
        paddingTop: 10,
        paddingLeft: 15,
        fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial'
      }}>{dayNumber}</Text>
      {/* Render task circles */}
    </View>
  );
};

export default DayNode;