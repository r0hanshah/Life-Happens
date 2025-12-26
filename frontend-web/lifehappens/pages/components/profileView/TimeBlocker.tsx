import React, { useEffect, useState } from 'react';
import UserModel from '@/models/UserModel';
import ProfileController from '@/controllers/profile/ProfileController';

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

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;

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
    <div style={{width:'100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>

      {/* Draw grid */}
      {gridColors.map((rowColors, rowIndex) => (
        <div key={rowIndex} style={{display: 'flex', flexDirection: 'row', marginBottom: (rowIndex + 1)/12 == 1 ? 30 : 0}}>
          {rowColors.map((color, colIndex) => (
            <button
              key={colIndex}
              style={{
                backgroundColor: color,
                width: windowWidth*0.49*0.10,
                height: 15,
                margin: 2,
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            />
          ))}

          {/* Number at the end of the row */}
          <button 
            onClick={() => {
              handleRowClick(rowIndex)
            }}
            style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
          >
            <span style={{color:'gray', width:50, marginLeft:5}}>{((rowIndex+1)%12) == 0 ? 12 : ((rowIndex+1)%12)} {((rowIndex)%12) == 0 ? (rowIndex )/12 == 1 ? 'PM' : 'AM' : rowIndex == 23 ? 'AM' : rowIndex == 11 ? 'PM' :''}</span>
          </button>
          
        </div>
      ))}

      {/* Day column labels */}
      <div style={{display:'flex', flexDirection:'row', width:'100%', marginRight:50, justifyContent:'space-around', paddingLeft: 20, paddingRight: 20}}>
        <button 
          onClick={() => {
            handleColumnClick(0)
          }}
          style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
        >
            <span style={{color:'gray'}}>Su</span>
        </button>
        <button 
          onClick={() => {
            handleColumnClick(1)
          }}
          style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
        >
            <span style={{color:'gray'}}>M</span>
        </button>
        <button 
          onClick={() => {
            handleColumnClick(2)
          }}
          style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
        >
            <span style={{color:'gray'}}>T</span>
        </button>
        <button 
          onClick={() => {
             handleColumnClick(3)
          }}
          style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
        >
            <span style={{color:'gray'}}>W</span>
        </button>
        <button 
          onClick={() => {
             handleColumnClick(4)
          }}
          style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
        >
            <span style={{color:'gray'}}>Th</span>
        </button>
        <button 
          onClick={() => {
             handleColumnClick(5)
          }}
          style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
        >
            <span style={{color:'gray'}}>F</span>
        </button>
        <button 
          onClick={() => {
             handleColumnClick(6)
          }}
          style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
        >
            <span style={{color:'gray'}}>S</span>
        </button>
        </div>
    </div>
  );
};

export default TimeBlocker;