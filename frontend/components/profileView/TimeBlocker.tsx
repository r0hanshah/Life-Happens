import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, Text } from 'react-native';

const TimeBlocker: React.FC = () => {
  const [gridColors, setGridColors] = useState<string[][]>(Array.from({ length: 24 }, () => Array(7).fill('#303030')));

  const windowWidth = useWindowDimensions().width;

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const newGridColors = [...gridColors];
    // Change color of the clicked cell
    newGridColors[rowIndex][colIndex] = newGridColors[rowIndex][colIndex] == '#303030' ? '#808080' : '#303030';
    setGridColors(newGridColors);
  };

  return (
    <View style={styles.container}>
      {gridColors.map((rowColors, rowIndex) => (
        <View key={rowIndex} style={[styles.row, {marginBottom: (rowIndex + 1)/12 == 1 ? 30 : 0}]}>
          {rowColors.map((color, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[styles.cell, { backgroundColor: color, width: windowWidth*0.49*0.10 }]}
              onPress={() => handleCellClick(rowIndex, colIndex)}
            />
          ))}
          <Text style={{color:'gray', width:40, marginLeft:5}}>{((rowIndex+1)%12) == 0 ? 12 : ((rowIndex+1)%12)} {((rowIndex)%12) == 0 ? (rowIndex )/12 == 1 ? 'PM' : 'AM' : ''}</Text>
        </View>
      ))}
      <View style={{flexDirection:'row', width:'100%', marginRight:50, justifyContent:'space-around'}}>
            <Text style={{color:'gray'}}>Su</Text>
            <Text style={{color:'gray'}}>M</Text>
            <Text style={{color:'gray'}}>T</Text>
            <Text style={{color:'gray'}}>W</Text>
            <Text style={{color:'gray'}}>Th</Text>
            <Text style={{color:'gray'}}>F</Text>
            <Text style={{color:'gray'}}>S</Text>
        </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    width:'100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    height: 15,
    margin: 2,
  },
});

export default TimeBlocker;