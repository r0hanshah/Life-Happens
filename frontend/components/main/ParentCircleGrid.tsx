import React, { useState, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Circle from './ParentTaskCircle';

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

  return (
    <View style={[styles.grid, {marginTop: offset * 8 + 10, width: windowWidth * 0.96}]}>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <Circle diameter={10} color={colors.hasOwnProperty('00') ? colors['00'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('01') ? colors['01'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('02') ? colors['02'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('03') ? colors['03'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('04') ? colors['04'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('05') ? colors['05'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('06') ? colors['06'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('07') ? colors['07'] : 'rgba(0,0,0,0)'}/>
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <Circle diameter={10} color={colors.hasOwnProperty('10') ? colors['10'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('11') ? colors['11'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('12') ? colors['12'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('13') ? colors['13'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('14') ? colors['14'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('15') ? colors['15'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('16') ? colors['16'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('17') ? colors['17'] : 'rgba(0,0,0,0)'}/>
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <Circle diameter={10} color={colors.hasOwnProperty('20') ? colors['20'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('21') ? colors['21'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('22') ? colors['22'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('23') ? colors['23'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('24') ? colors['24'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('25') ? colors['25'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('26') ? colors['26'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('27') ? colors['27'] : 'rgba(0,0,0,0)'}/>
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9)}]}>
        <Circle diameter={10} color={colors.hasOwnProperty('30') ? colors['30'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('31') ? colors['31'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('32') ? colors['32'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('33') ? colors['33'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('34') ? colors['34'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('35') ? colors['35'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('36') ? colors['36'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('37') ? colors['37'] : 'rgba(0,0,0,0)'}/>
      </View>
      <View style={[styles.row, { height: ((windowHeight / 6) * 0.9 + 50.5)}]}>
        <Circle diameter={10} color={colors.hasOwnProperty('40') ? colors['40'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('41') ? colors['41'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('42') ? colors['42'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('43') ? colors['43'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('44') ? colors['44'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('45') ? colors['45'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('46') ? colors['46'] : 'rgba(0,0,0,0)'}/>
        <Circle diameter={10} color={colors.hasOwnProperty('47') ? colors['47'] : 'rgba(0,0,0,0)'}/>
      </View>
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