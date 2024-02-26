// BorderComponent.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

interface BorderComponentProps {
  id: string;
  borderColor: string;
  orientation: 'horizontal' | 'vertical'; // Specify the valid values for orientation
  lastRow: boolean;
}

const BorderComponent: React.FC<BorderComponentProps> = ({ borderColor, orientation, lastRow }) => {
  const borderStyle = orientation === 'horizontal' ? styles.horizontalBorder : styles.verticalBorder;

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  return <View style={[{ borderColor }, borderStyle, { width: orientation === 'horizontal' ? (windowWidth / 7) * 0.9 : 0, height: orientation === 'vertical' ? (windowHeight / 6) * 0.8 : lastRow ? (windowHeight / 6) * 0.8 + 50 : 0, paddingTop: orientation === 'horizontal' ? (windowHeight / 6) * 0.8 -1.5 : lastRow ? (windowHeight / 6) * 0.8 + 50.5 : 0 }]} />;
};

const styles = StyleSheet.create({
  border: {
    flex: 1,
  },
  horizontalBorder: {
    paddingTop: 48.5,
    height: 1,
    borderBottomWidth: 2, // Customize for horizontal orientation
  },
  verticalBorder: {
    width: 1,
    minHeight: 50,
    borderRightWidth: 2, // Customize for vertical orientation
  },
});

export default BorderComponent;