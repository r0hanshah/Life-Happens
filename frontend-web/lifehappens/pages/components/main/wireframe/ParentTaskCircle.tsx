import React from 'react';
import { View, ViewStyle } from 'react-native';

interface CircleProps {
  diameter: number;
  color: string;
}

const Circle: React.FC<CircleProps> = ({ diameter, color }) => {
  const circleStyle: ViewStyle = {
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2, // Make it a circle
    borderWidth: 2,
    borderColor: color,
  };

  return <View style={[circleStyle, {backgroundColor: color == 'rgba(0,0,0,0)' ? color : 'black'}]} />;
};

export default Circle;