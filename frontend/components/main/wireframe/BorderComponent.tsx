// BorderComponent.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';

interface BorderComponentProps {
  id: string;
  colorQueue: Array<[string, number, string, boolean, boolean?, boolean?]>;
  orientation: 'horizontal' | 'vertical'; // Specify the valid values for orientation
  lastRow: boolean;
  numberOfRows: number
}

const BorderComponent: React.FC<BorderComponentProps> = ({ colorQueue, orientation, lastRow }) => {
  const borderStyle = orientation === 'horizontal' ? styles.horizontalBorder : styles.verticalBorder;

  const windowWidth = useWindowDimensions().width;
  const windowHeight = 630;

  const renderBorders = () => {
    return colorQueue.map((value, index) => {
      let backgroundColor = value[0], 
          amountFill = value[1] , 
          rootTaskId = value[2], 
          leftBound = value[3], 
          placedInlastRow= value[4] ? value[4] : false ,
          pointLeft = value[5] ? value[5] : false

      const borderStyle = orientation === 'horizontal' ? styles.horizontalBorder : styles.verticalBorder;
      const containerStyle = orientation === 'horizontal' ? (leftBound? styles.HLContainer : styles.HRContainer) : styles.VContainer
      const zIndex = -(index + 1); // Set zIndex to stack borders

      const existsInLastRowOnly = amountFill < 0
      amountFill = Math.abs(amountFill)

      return (
        <View key={`cont${index}`} style={[containerStyle, {
          width: '100%',
          height: '100%',
          justifyContent: lastRow ? "flex-start" : "center"
        }, placedInlastRow && orientation === 'vertical' ? {alignItems:'flex-end'} : orientation === 'vertical' ? {alignItems: 'center', flexDirection:'column'} : {}]}>
          {/* Empty space for when drawing vertical lines */}
          <View style={[{
            height: orientation==='vertical'? lastRow ? ((windowHeight / 6) * 0.9 + 50)*(1-amountFill < 0 ? 0 : 1-amountFill) : ((windowHeight / 6) * 0.9)*(1-amountFill) : 2,
            display: orientation==='vertical'? 'flex' : 'none'
          }]} />
          {/* The actual wire being drawn */}
          <View
            key={index}
            style={[
              {
                zIndex:zIndex,
                position: orientation==='horizontal' ? 'absolute' : 'relative',
                backgroundColor: backgroundColor,
                width: orientation === 'horizontal' ? ((windowWidth / 7) * 0.83)*(leftBound ? amountFill : amountFill==1 ? 1 :  1-amountFill) + (amountFill == 1 ? 2 : 0) : 2,
                height: orientation === 'vertical' ?  lastRow ? ((windowHeight / 6)* 0.9)*amountFill + 50 : ((windowHeight / 6) * 0.9)*amountFill : 2,
                top: orientation ==='vertical'? lastRow && amountFill <= 1 ? -48*(1-amountFill): 0: 2
              },
              existsInLastRowOnly ? {top: 144.5} : {}
            ]}
          />
          {/* Wire that connects the rest of the wire to the day it belongs to */}
          {
            amountFill < 1 &&
            <View
            key={index + 0.5}
            style={[
              {
                zIndex: zIndex,
                position: 'absolute',
                backgroundColor: backgroundColor,
                width: orientation === 'horizontal' ? 2 : 20,
                height: orientation === 'vertical' ?  2 : 20 + (lastRow ? 50: 0),
                top: orientation ==='vertical'? lastRow ? -48*(1-amountFill) : ((windowHeight / 6) * 0.9)*(1-amountFill) : -16 - (lastRow ? 50: 0)
              },
              existsInLastRowOnly ? {top: 144.5} : {},
              orientation == 'vertical' ? pointLeft ? {right:2} : {left:2} : leftBound ? {left: ((windowWidth / 7) * 0.83)*(leftBound ? amountFill : amountFill==1 ? 1 :  1-amountFill) + (amountFill == 1 ? 2 : 0)} : {right: ((windowWidth / 7) * 0.83)*(leftBound ? amountFill : amountFill==1 ? 1 :  1-amountFill) + (amountFill == 1 ? 2 : 0)}
            ]}
            />
          }
          {/* Wire that connects the rest to the task it belongs to */}
          {
            lastRow && orientation === 'vertical' &&
            <View
            key={index + 0.9}
            style ={[
              {
                zIndex: zIndex,
                position: 'absolute',
                backgroundColor: backgroundColor,
                width: 100,
                height: 2,
                top: ((windowHeight / 6)* 0.9)*amountFill + 50 + (existsInLastRowOnly ? 144.5 : 0)
              },
              leftBound ? {left:0} : {right:0}
            ]}
            />
          }
        </View>
      );
    });
  };

  return (
    <View style={[styles.container, { width: orientation==='horizontal' ? (windowWidth/7)*0.83 : 2, height: orientation === 'vertical' && lastRow ? (windowHeight / 6) * 0.9 + 50 : orientation === 'vertical' ? (windowHeight / 6) * 0.9 : 2}]}>
      {renderBorders()}
      <View key= 'base' style={{
        position:'absolute', 
        zIndex:-999, 
        backgroundColor:'rgba(255, 255, 255, 0)', 
        width: orientation==='horizontal' ? (windowWidth/7)*0.83 : 2, 
        height: orientation === 'vertical' && lastRow? (windowHeight / 6) * 0.9 + 50 : orientation === 'vertical' ? (windowHeight / 6) * 0.9 : 2, 
        top: 2}}/>
      {/* <View key='base' style={[ borderStyle, {zIndex: -999, borderColor: 'rgba(255, 255, 255, 0.1)', width: orientation === 'horizontal' ? (windowWidth / 7) * 0.89 : 0, height: orientation === 'vertical' ? (windowHeight / 6) * 0.9 : lastRow ? (windowHeight / 6) * 0.9 + 50 : 0, paddingTop: orientation === 'horizontal' ? (windowHeight / 6) * 0.9 -1.5 : lastRow ? (windowHeight / 6) * 0.9 + 50.5 : 0 }]} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  HLContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  HRContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  VContainer: {
    position: 'absolute',
    justifyContent: 'center',
  },
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    flex: 1,
  },
  horizontalBorder: {
    top: 48.5,
    height: 1,
    // borderBottomWidth: 2, // Customize for horizontal orientation
  },
  verticalBorder: {
    width: 1,
    minHeight: 50,
    // borderRightWidth: 2, // Customize for vertical orientation
  },
});

export default BorderComponent;