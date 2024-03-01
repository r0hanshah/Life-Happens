// BorderComponent.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

interface BorderComponentProps {
  id: string;
  colorQueue: Array<[string, number, string, boolean]>;
  orientation: 'horizontal' | 'vertical'; // Specify the valid values for orientation
  lastRow: boolean;
}

const BorderComponent: React.FC<BorderComponentProps> = ({ colorQueue, orientation, lastRow }) => {
  const borderStyle = orientation === 'horizontal' ? styles.horizontalBorder : styles.verticalBorder;

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const renderBorders = () => {
    return colorQueue.map((value, index) => {
      const borderColor = value[0], amountFill = value[1], rootTaskId = value[2], leftBound = value[3]
      const borderStyle = orientation === 'horizontal' ? styles.horizontalBorder : styles.verticalBorder;
      const containerStyle = orientation === 'horizontal' ? (leftBound? styles.HLContainer : styles.HRContainer) : styles.VContainer
      const zIndex = -(index + 1); // Set zIndex to stack borders

      return (
        <View style={[containerStyle, {
          width: orientation === 'horizontal' ? ((windowWidth / 7) * 0.85) : 0,
          height: orientation === 'vertical' ? ((windowHeight / 6) * 0.9) : lastRow ? ((windowHeight / 6) * 0.9 + 50) : 0
        }]}>
          <View
            key={index}
            style={[
              { borderColor, zIndex },
              borderStyle,
              {
                minHeight: 0,
                width: orientation === 'horizontal' ? ((windowWidth / 7) * 0.85)*(leftBound ? amountFill : amountFill != 1 ? 1-amountFill : 1) : 0,
                height: orientation === 'vertical' ? ((windowHeight / 6) * 0.9)*amountFill : lastRow ? ((windowHeight / 6) * 0.9 + 50)*amountFill : 0,
                paddingTop: orientation === 'horizontal' ? (windowHeight / 6) * 0.9 + 1.5 : lastRow ? (windowHeight / 6) * 0.9 + 50.5 : 0,
              },
            ]}
          />
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {renderBorders()}
      <View style={[ borderStyle, {zIndex: -999, borderColor: 'rgba(255, 255, 255, 0)', width: orientation === 'horizontal' ? (windowWidth / 7) * 0.89 : 0, height: orientation === 'vertical' ? (windowHeight / 6) * 0.9 : lastRow ? (windowHeight / 6) * 0.9 + 50 : 0, paddingTop: orientation === 'horizontal' ? (windowHeight / 6) * 0.9 -1.5 : lastRow ? (windowHeight / 6) * 0.9 + 50.5 : 0 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  HLContainer: {
    flex:1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  HRContainer: {
    flex:1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  VContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
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