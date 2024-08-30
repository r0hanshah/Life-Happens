import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, TouchableHighlight } from 'react-native';
import Circle from './ParentTaskCircle';
import moment from 'moment';

import TaskModel from '../../../models/TaskModel';
import MainController from '../../../controllers/main/MainController';

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

  const windowWidth = useWindowDimensions().width;
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
          <View key={id}>
            { colors.hasOwnProperty(id) && parentTasks.hasOwnProperty(id) ? (
              <TouchableHighlight  style={{borderRadius: 10}} onPress={() => controller.setSelectedTask(parentTasks[id])}>
                <Circle diameter={10} color={colors.hasOwnProperty(id) ? colors[id] : 'rgba(0,0,0,0)'}/>
              </TouchableHighlight>
            ) :
            (
              <Circle  diameter={10} color={colors.hasOwnProperty(id) ? colors[id] : 'rgba(0,0,0,0)'}/>
            )
            }
          </View>
        );
      }
  
      components.push(
        <View key={`row${row}`} style={[styles.row, { position:'absolute', top: ((windowHeight / 6) * 0.9 )*(row)-(rows > 5 ? 222  : 175) + (row == rows-1 ? 50 : 0), width:'100%'}]}>
          {rowComponents}
        </View>
      );
    }

    return components;
  };

  return (
    <View style={[styles.grid, {marginTop: offset * 8 + 10, width: windowWidth * 0.96}]}>
      {renderParentNodeGrid(colors, parentTasksMap)}
      {/* Display another row only if there are not enough days to represent all days in the calendar */}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    position: 'absolute',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
});

export default ParentNodeGridComponent;