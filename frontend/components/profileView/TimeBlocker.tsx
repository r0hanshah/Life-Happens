import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, Text } from 'react-native';
import UserModel from '../../models/UserModel';
import ProfileController from '../../controllers/profile/ProfileController';

interface TimeBlockerInterface {
    user: UserModel
}

const TimeBlocker: React.FC<TimeBlockerInterface> = ({user}) => {
  const profileViewController = new ProfileController()

  const [gridColors, setGridColors] = useState<string[][]>(Array.from({ length: 24 }, () => Array(7).fill('#303030')));
  const [gridBools, setGridBools] = useState<boolean[][]>(user.restPeriods);

  const [changes, setChanges] = useState('');
  const [queuedRequest, setQueuedRequest] = useState<NodeJS.Timeout | null>(null)

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

  // Make a call to the backend to update user's rest periods
  useEffect(()=> {
    const intervalId = setInterval(() => {
      if(changes)
      {
        // Compile string representation of each cell into an array to be stored
        var restPeriods = []

        for (var i = 0; i < 24; i ++)
          for(var j = 0; j < 7; j ++)
            if (gridBools[i][j])
              restPeriods.push(i+','+j)

        // Send request to backend

        
        console.log("Logged changes!")

        profileViewController.handleSaveRestPeriod(restPeriods, user.id)

        setChanges('');
      }
      
    }, 1000)

    setQueuedRequest(intervalId)

    return () => clearInterval(intervalId);
  }, [changes])

  const windowWidth = useWindowDimensions().width;

  const handleCellClick = (rowIndex: number, colIndex: number, override:boolean = false) => {
    const newGridColors = [...gridColors];
    // Change color of the clicked cell
    newGridColors[rowIndex][colIndex] = override ? '#303030' : newGridColors[rowIndex][colIndex] == '#303030' ? '#808080' : '#303030';
    gridBools[rowIndex][colIndex] = newGridColors[rowIndex][colIndex] == '#808080'
    user.restPeriods = gridBools
    setGridColors(newGridColors);
    setGridBools(gridBools);
    if (queuedRequest)
      clearInterval(queuedRequest)
    setChanges(rowIndex + colIndex + '!');
  };

  const handleRowClick = (rowIndex: number) => {
    const newGridColors = [...gridColors];
    var bool_count = 0

    for(var i = 0; i < 7; i++) {
      if (gridBools[rowIndex][i])
        bool_count += 1
    }

    if (bool_count < 7 || bool_count == 0)
    {
      for(var i = 0; i < 7; i++) {
          gridBools[rowIndex][i] = true
          newGridColors[rowIndex][i] = '#808080'
      }
    }
    else 
    {
      for(var i = 0; i < 7; i++) {
          gridBools[rowIndex][i] = false
          newGridColors[rowIndex][i] = '#303030'
      }
    }

    user.restPeriods = gridBools

    setGridColors(newGridColors);
    setGridBools(gridBools);
    if (queuedRequest)
      clearInterval(queuedRequest)
    setChanges(rowIndex + '!=>')
  }

  const handleColumnClick = (columnIndex: number) => {
    const newGridColors = [...gridColors];
    var bool_count = 0

    for(var i = 0; i < 24; i++) {
      if (gridBools[i][columnIndex])
        bool_count += 1
    }

    if (bool_count < 24 || bool_count == 0)
    {
      for(var i = 0; i < 24; i++) {
          gridBools[i][columnIndex] = true
          newGridColors[i][columnIndex] = '#808080'
      }
    }
    else 
    {
      for(var i = 0; i < 24; i++) {
          gridBools[i][columnIndex] = false
          newGridColors[i][columnIndex] = '#303030'
      }
    }

    user.restPeriods = gridBools

    setGridColors(newGridColors);
    setGridBools(gridBools)
    if (queuedRequest)
      clearInterval(queuedRequest)
    setChanges(columnIndex + '!^')
  }

  return (
    <View style={styles.container}>

      {/* Draw grid */}
      {gridColors.map((rowColors, rowIndex) => (
        <View key={rowIndex} style={[styles.row, {marginBottom: (rowIndex + 1)/12 == 1 ? 30 : 0}]}>
          {rowColors.map((color, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[styles.cell, { backgroundColor: color, width: windowWidth*0.49*0.10 }]}
              onPress={() => handleCellClick(rowIndex, colIndex)}
            />
          ))}

          {/* Number at the end of the row */}
          <TouchableOpacity onPress={() => {
            handleRowClick(rowIndex)
          }}>
            <Text style={{color:'gray', width:50, marginLeft:5}}>{((rowIndex+1)%12) == 0 ? 12 : ((rowIndex+1)%12)} {((rowIndex)%12) == 0 ? (rowIndex )/12 == 1 ? 'PM' : 'AM' : rowIndex == 23 ? 'AM' : rowIndex == 11 ? 'PM' :''}</Text>
          </TouchableOpacity>
          
        </View>
      ))}

      {/* Day column labels */}
      <View style={{flexDirection:'row', width:'100%', marginRight:50, justifyContent:'space-around', paddingHorizontal:20}}>
        <TouchableOpacity onPress={() => {
            handleColumnClick(0)
        }}>
            <Text style={{color:'gray'}}>Su</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            handleColumnClick(1)
        }}>
            <Text style={{color:'gray'}}>M</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
            handleColumnClick(2)
        }}>
            <Text style={{color:'gray'}}>T</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
             handleColumnClick(3)
        }}>
            <Text style={{color:'gray'}}>W</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
             handleColumnClick(4)
        }}>
            <Text style={{color:'gray'}}>Th</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
             handleColumnClick(5)
        }}>
            <Text style={{color:'gray'}}>F</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
             handleColumnClick(6)
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