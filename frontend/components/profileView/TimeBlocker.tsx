import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, Text } from 'react-native';
import UserModel from '../../models/UserModel';

interface TimeBlockerInterface {
    user: UserModel
}

const TimeBlocker: React.FC<TimeBlockerInterface> = ({user}) => {
  const [gridColors, setGridColors] = useState<string[][]>(Array.from({ length: 24 }, () => Array(7).fill('#303030')));
  const [gridBools, setGridBools] = useState<boolean[][]>(user.restPeriods);

  useEffect(()=>{
    const newGridColors = [...gridColors];
    for(var i = 0; i < user.restPeriods.length; i++)
    {
        for(var j = 0; j < user.restPeriods[0].length; j++)
        {
            newGridColors[i][j] = user.restPeriods[i][j] ? '#808080' : '#303030'
        }
    }
    setGridColors(newGridColors);
  }, [user])

  const windowWidth = useWindowDimensions().width;

  const handleCellClick = (rowIndex: number, colIndex: number, override:boolean = false) => {
    const newGridColors = [...gridColors];
    // Change color of the clicked cell
    newGridColors[rowIndex][colIndex] = override ? '#303030' : newGridColors[rowIndex][colIndex] == '#303030' ? '#808080' : '#303030';
    gridBools[rowIndex][colIndex] = newGridColors[rowIndex][colIndex] == '#808080'
    user.restPeriods = gridBools
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
          <TouchableOpacity onPress={() => {
            for(var i = 0; i < rowColors.length; i++)
            {
                handleCellClick(rowIndex, i)
            }
          }}>
            <Text style={{color:'gray', width:40, marginLeft:5}}>{((rowIndex+1)%12) == 0 ? 12 : ((rowIndex+1)%12)} {((rowIndex)%12) == 0 ? (rowIndex )/12 == 1 ? 'PM' : 'AM' : ''}</Text>
          </TouchableOpacity>
          
        </View>
      ))}
      <View style={{flexDirection:'row', width:'100%', marginRight:50, justifyContent:'space-around', paddingHorizontal:20}}>
        <TouchableOpacity onPress={() => {
            for(var i = 0; i < gridColors.length; i++)
            {
                handleCellClick(i, 0)
            }
        }}>
            <Text style={{color:'gray'}}>Su</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            for(var i = 0; i < gridColors.length; i++)
            {
                handleCellClick(i, 1)
            }
        }}>
            <Text style={{color:'gray'}}>M</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            for(var i = 0; i < gridColors.length; i++)
            {
                handleCellClick(i, 2)
            }
        }}>
            <Text style={{color:'gray'}}>T</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            for(var i = 0; i < gridColors.length; i++)
            {
                handleCellClick(i, 3)
            }
        }}>
            <Text style={{color:'gray'}}>W</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            for(var i = 0; i < gridColors.length; i++)
            {
                handleCellClick(i, 4)
            }
        }}>
            <Text style={{color:'gray'}}>Th</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            for(var i = 0; i < gridColors.length; i++)
            {
                handleCellClick(i, 5)
            }
        }}>
            <Text style={{color:'gray'}}>F</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            for(var i = 0; i < gridColors.length; i++)
            {
                handleCellClick(i, 6)
            }
        }}>
            <Text style={{color:'gray'}}>S</Text>
        </TouchableOpacity>
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