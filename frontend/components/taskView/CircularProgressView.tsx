import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Circle, LinearGradient, Stop } from 'react-native-svg';

const CircularProgressBar = ({ percentage }: {percentage:number })  => {
    // Calculate the radius, circumference, and stroke width
    const radius = 15;
    const strokeWidth = 2;
    const circumference = 2 * Math.PI * radius;
    
    // Calculate the progress value
    const progress = circumference - (percentage) * circumference;
    
    return (
      <View style={styles.container}>
        <Svg height="40" width="40">
          {/* Draw the gradient background */}
          <Circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="#303030"
            strokeWidth={strokeWidth}
          />
          {/* Draw the progress bar */}
          <Circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
          />
          {/* Define the linear gradient */}
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#00ff00" />
            <Stop offset="100%" stopColor="#00ff00" />
          </LinearGradient>
        </Svg>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight:10,
      transform:[{rotate: '-90deg'}]
    },
  });

  export default CircularProgressBar