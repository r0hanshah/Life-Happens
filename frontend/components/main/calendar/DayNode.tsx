import React from 'react';
import { View, ViewStyle, useWindowDimensions, Text } from 'react-native';

interface DayNodeProps {
  dayNumber: number;
  dayOfWeek: number;
  leafTasks: string[];
  currentDay: boolean; 
}

const DayNode: React.FC<DayNodeProps> = ({ dayNumber, dayOfWeek, leafTasks, currentDay }) => {

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const containerStyle:ViewStyle=
  {
    backgroundColor: currentDay ? '#00488A' : '#383838',
    height: windowHeight/6 * 0.35,
    maxHeight: 50,
    width: windowWidth/7 * 0.7,
    borderRadius: 20,
    justifyContent: 'flex-start'
  }

  return( 
    <View style={containerStyle}>
      <Text style={{
        color: '#fff',
        paddingTop: 10,
        paddingLeft: 15
      }}>{dayNumber}</Text>
    </View>
  );
};

export default DayNode;