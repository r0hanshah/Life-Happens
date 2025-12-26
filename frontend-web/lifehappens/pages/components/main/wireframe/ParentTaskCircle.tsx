import React from 'react';

interface CircleProps {
  diameter: number;
  color: string;
}

const Circle: React.FC<CircleProps> = ({ diameter, color }) => {
  const circleStyle: React.CSSProperties = {
    width: diameter,
    height: diameter,
    borderRadius: diameter / 2, // Make it a circle
    borderWidth: 2,
    borderColor: color,
    backgroundColor: color === 'rgba(0,0,0,0)' ? color : 'black'
  };

  return <div style={circleStyle} />;
};

export default Circle;