import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Circle from './ParentTaskCircle';
import moment from 'moment';

interface GridProps {
  offset: number;
  parentNodes: string[]; // row,column,color
}

interface ColorMapType {
  [key: string]: string; // key: <row><column> => value: <colorString>
}

const ParentNodeGridComponent: React.FC<GridProps> = ({ offset, parentNodes }) => {

  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const [colors, setColors] = useState<ColorMapType>({});

  const [currentMonth, setCurrentMonth] = useState(moment());

  // useEffect to compute the value when myParameter changes
  useEffect(() => {
    const computedResult:{[key: string]: string}  = generateColorMap(parentNodes);
    setColors(computedResult);
  }, [parentNodes]);

  const generateColorMap = (ids: string[]): {[key: string]: string} =>
  {
    const colorMap: {[key: string]: string} = {}

    for(const id of ids)
    {
      const parentComponents = id.split(',')
      const row = parentComponents[0]
      const col = parentComponents[1]
      const color = parentComponents[2]

      if(colorMap.hasOwnProperty(row+col)) { continue }

      colorMap[row+col] = color
    }

    return colorMap
  }

  const renderParentNodeGrid = (colors: any) => {
    const firstDayOfMonth = currentMonth.clone().startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = firstDayOfMonth.clone().startOf('week');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

    const daysDifference = endDay.diff(startDay, 'days');

    const columns = 8;
    const components = [];
    for(var row = 0; row < daysDifference; row+=7)
    {
      const rowComponents = [];
  
      for (let col = 0; col < columns; col++) {
        const id = `${row/7}${col}`;
  
        rowComponents.push(
          <Circle key={id} diameter={10} color={colors.hasOwnProperty(id) ? colors[id] : 'rgba(0,0,0,0)'}/>
        );
      }
  
      components.push(
        <View key={`row${row/7}`} style={[styles.row, { height: ((windowHeight / 6) * 0.9 + (row/7 == daysDifference/7 - 1 ? 50.5 : 0))}]}>
          {rowComponents}
        </View>
      );
    }

    return components;
  };

  return (
    <View style={[styles.grid, {marginTop: offset * 8 + 10, width: windowWidth * 0.96}]}>
      {renderParentNodeGrid(colors)}
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