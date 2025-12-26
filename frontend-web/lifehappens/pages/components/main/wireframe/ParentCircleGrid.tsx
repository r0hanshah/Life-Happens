import React, { useState, useEffect } from 'react';
import Circle from './ParentTaskCircle';
import moment from 'moment';

import TaskModel from '@/models/TaskModel';
import MainController from '@/controllers/main/MainController';

interface GridProps {
  offset: number;
  parentNodeIds: string[]; // row,column,color
  parentTasks: TaskModel[];
  inMoment: moment.Moment;
}

interface ColorMapType {
  [key: string]: string; // key: <row><column> => value: <colorString>
}

const ParentNodeGridComponent: React.FC<GridProps> = ({ offset, parentNodeIds, parentTasks, inMoment }) => {

  const controller = MainController.getInstance();

  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const windowHeight = 630;

  const [colors, setColors] = useState<ColorMapType>({});
  const [parentTasksMap, setParentTasksMap] = useState<{[key: string]: TaskModel}>({})

  const [currentMonth, setCurrentMonth] = useState(inMoment);

  useEffect(()=>{
    setCurrentMonth(moment(inMoment))
  }, [inMoment])

  // useEffect to compute the value when myParameter changes
  useEffect(() => {
    const computedResult= generateColorMap(parentNodeIds);
    setColors(computedResult[0]);
    setParentTasksMap(computedResult[1])
  }, [parentNodeIds]);

  const generateColorMap = (ids: string[]): [{[key: string]: string}, {[key: string]: TaskModel}] =>
  {
    const colorMap: {[key: string]: string} = {}
    const taskMap: {[key: string]: TaskModel} = {}

    for(var i = 0; i < ids.length; i++)
    {
      const id = ids[i]
      const parentTask = parentTasks[i]
      const parentComponents = id.split(',')
      const row = parentComponents[0]
      const col = parentComponents[1]
      const color = parentComponents[2]

      if(colorMap.hasOwnProperty(row+col)) { continue }

      colorMap[row+col] = color
      taskMap[row+col] = parentTask
    }

    return [colorMap, taskMap]
  }

  const renderParentNodeGrid = (colors: any, parentTasks:any) => {
    const firstDayOfMonth = currentMonth.clone().startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = firstDayOfMonth.clone().startOf('week');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

    const daysDifference = endDay.diff(startDay, 'days');
    const rows = (daysDifference+1)/7

    const columns = 8;
    const components = [];
    for(var row = 0; row < rows; row++)
    {
      const rowComponents = [];
  
      for (let col = 0; col < columns; col++) {
        const id = `${row}${col}`;
  
        rowComponents.push(
          <div key={id}>
            { colors.hasOwnProperty(id) && parentTasks.hasOwnProperty(id) ? (
              <button 
                onClick={() => controller.setSelectedTask(parentTasks[id])}
                style={{borderRadius: 10, zIndex:999, border: 'none', padding: 0, cursor: 'pointer', backgroundColor: 'transparent'}}
              >
                <Circle diameter={10} color={colors.hasOwnProperty(id) ? colors[id] : 'rgba(0,0,0,0)'}/>
              </button>
            ) :
            (
              <Circle  diameter={10} color={colors.hasOwnProperty(id) ? colors[id] : 'rgba(0,0,0,0)'}/>
            )
            }
          </div>
        );
      }
  
      components.push(
        <div key={`row${row}`} style={{ position:'absolute', top: ((windowHeight / 6) * 0.9 )*(row)-(rows > 5 ? 222  : 175) + (row == rows-1 ? 50 : 0), width:'100%', display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' }}>
          {rowComponents}
        </div>
      );
    }

    return components;
  };

  return (
    <div style={{marginTop: offset * 8 + 10, width: windowWidth * 0.96, flex: 1, position: 'absolute'}}>
      {renderParentNodeGrid(colors, parentTasksMap)}
      {/* Display another row only if there are not enough days to represent all days in the calendar */}
    </div>
  );
};

export default ParentNodeGridComponent;