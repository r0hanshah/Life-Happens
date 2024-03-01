import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BorderComponent from './BorderComponent';
import Circle from './ParentTaskCircle';

interface GridProps {
  offset: number;
  subtaskDispIds: string[]; // Hexcode,id|||path_rootid===inter_row,inter_column:::path_id===row,column,index,left_bound // TODO: Change to date with task id and then do more preprocessing
                            // Ideally, the leaf tasks of the root tasks will be passed together
}

interface ColorQueueType {
  [key: string]: Set<[string, number, string, boolean]>;
}

const GridComponent: React.FC<GridProps> = ({ offset, subtaskDispIds }) => {

  const [colorQueues, setColorQueues] = useState<ColorQueueType>({});

  // useEffect to compute the value when myParameter changes
  useEffect(() => {
    const computedResult:{[key: string]: Set<[string, number, string, boolean]>}  = generatePathsForIds(subtaskDispIds);
    setColorQueues(computedResult);
  }, [subtaskDispIds]);


  const generatePathsForIds = (ids : string[]): { [key: string]: Set<[string, number, string, boolean]> } => // Returns array of #COLORHEX, Amount fill (0-1), root_task_id
  {
    /*
      This function assumes the parent id index has already been calculated and the subtask indices have also been calculated
    */
    var colorQueuesMap:{[key: string]: Set<[string, number, string, boolean]>} = {}

    for(const id of ids)
    {
      //Seperate id into components ( origindata | specific_data => '|||'
      //                              parentid | leafid => ':::'
      //                              path_id | placement_inf0||path_id | placement_info => '==='
      //                              path_id | inter_row | inter_column || path_id | row | column | index => ','
      //                              )
      const originAndSpecificData = id.split('|||')
      const hexcodeAndParentId = originAndSpecificData[0].split(',')

      // Extract Hexcode and parent id
      const hexcode = hexcodeAndParentId[0]
      const rootId = hexcodeAndParentId[1]

      // Extract positional features
      const specificData = originAndSpecificData[1]

      const parentAndLeaf = specificData.split(':::')

      if (parentAndLeaf.length == 2 ) // Parent exists
      {
        // Parent Node
        const parentPathIdAndPlacementInfo = parentAndLeaf[0].split('===')
        const parentPathId = parentPathIdAndPlacementInfo[0]
        const parentRowColumnIndex = parentPathIdAndPlacementInfo[1].split(',')

        const pRow = parseInt(parentRowColumnIndex[0], 10)
        const pColumn = parseInt(parentRowColumnIndex[1], 10)
        const pIndex = parseInt(parentRowColumnIndex[2], 10)

        // Leaf Node
        const leafPathIdAndPlacementInfo = parentAndLeaf[1].split('===')
        const pathId = leafPathIdAndPlacementInfo[0]
        const rowColumnIndex = leafPathIdAndPlacementInfo[1].split(',')

        const lRow = parseInt(rowColumnIndex[0], 10)
        const lColumn = parseInt(rowColumnIndex[1], 10)
        const lIndex = parseInt(rowColumnIndex[2], 10)
        const leftBound:boolean = rowColumnIndex[3] == '1'
      }
      else if (parentAndLeaf.length == 1) // Only root task is parent
      {
        const leafPathIdAndPlacementInfo = parentAndLeaf[0].split('===')
        const pathId = leafPathIdAndPlacementInfo[0]
        const rowColumnIndex = leafPathIdAndPlacementInfo[1].split(',')

        const row = parseInt(rowColumnIndex[0], 10)
        const column = parseInt(rowColumnIndex[1], 10)
        const index = parseInt(rowColumnIndex[2], 10)
        const leftBound:boolean = rowColumnIndex[3] == '1'

        const prioritized:boolean = index <= 3

        // Create key values for horizontal borders to fill in row of subtask and fill queus 
        if(prioritized)
        {
          // Draw line from calendar node to 
          if(colorQueuesMap.hasOwnProperty(`${row}h${column}`))
          {
            colorQueuesMap[`${row}h${column}`].add([hexcode, 0.25 * index, rootId, leftBound])
          }
          else
          {
            colorQueuesMap[`${row}h${column}`] = new Set([[hexcode, 0.25 * index, rootId, leftBound]])
          }
         
          // Draw horizontal lines for second level subtasks 
          var columnOffset:number = column
          while(leftBound ? columnOffset > 0 : columnOffset < 7)
          {
            leftBound ? columnOffset -= 1 : columnOffset += 1;
            if(colorQueuesMap.hasOwnProperty(`${row}h${columnOffset}`))
            {
              colorQueuesMap[`${row}h${columnOffset}`].add([hexcode, 1, rootId, leftBound])
            }
            else
            {
              colorQueuesMap[`${row}h${columnOffset}`] = new Set([[hexcode, 1, rootId, leftBound]])
            }
          }

          // Draw vertical lines
          var rowOffset:number = row
          while(rowOffset < 4)
          {
            rowOffset += 1
            if(colorQueuesMap.hasOwnProperty(`${rowOffset}h${columnOffset}`))
            {
              colorQueuesMap[`${rowOffset}v${columnOffset}`].add([hexcode, 1, rootId, leftBound])
            }
            else
            {
              colorQueuesMap[`${rowOffset}v${columnOffset}`] = new Set([[hexcode, 1, rootId, leftBound]])
            }
          }

        }
        else
        {
          throw new Error("Not Implemented")
        }
      }
      else
      {
        throw new Error(`Unexpected data format in id: ${id}`);
      }
      // IF NO PARENT => Check if column less than or equal to 3 => add to id 
    }
    


    return colorQueuesMap;
  };



  return (
    <View style={[styles.grid, {marginTop: offset * 8}]}>
      <View style={styles.row}>
        <BorderComponent id='0v0' colorQueue={colorQueues.hasOwnProperty('0v0')? Array.from(colorQueues['0v0']) : []} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h0' colorQueue={colorQueues.hasOwnProperty('0h0')? Array.from(colorQueues['0h0']) : []} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v1' colorQueue={colorQueues.hasOwnProperty('0v1')? Array.from(colorQueues['0v1']) : []} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h1' colorQueue={colorQueues.hasOwnProperty('0h1')? Array.from(colorQueues['0h1']) : []} orientation="horizontal" lastRow = {false}  />
 
        <BorderComponent id='0v2' colorQueue={colorQueues.hasOwnProperty('0v2')? Array.from(colorQueues['0v2']) : []} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h2' colorQueue={colorQueues.hasOwnProperty('0h2')? Array.from(colorQueues['0h2']) : []} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v3' colorQueue={colorQueues.hasOwnProperty('0v3')? Array.from(colorQueues['0v3']) : []} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h3' colorQueue={colorQueues.hasOwnProperty('0h3')? Array.from(colorQueues['0h3']) : []} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v4' colorQueue={colorQueues.hasOwnProperty('0v4')? Array.from(colorQueues['0v4']) : []} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h4' colorQueue={colorQueues.hasOwnProperty('0h4')? Array.from(colorQueues['0h4']) : []} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v5' colorQueue={colorQueues.hasOwnProperty('0v5')? Array.from(colorQueues['0v5']) : []} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h5' colorQueue={colorQueues.hasOwnProperty('0h5')? Array.from(colorQueues['0h5']) : []} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v6' colorQueue={colorQueues.hasOwnProperty('0v6')? Array.from(colorQueues['0v6']) : []} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h6' colorQueue={colorQueues.hasOwnProperty('0h6')? Array.from(colorQueues['0h6']) : []} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v7' colorQueue={colorQueues.hasOwnProperty('0v7')? Array.from(colorQueues['0v7']) : []} orientation="vertical"  lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='1v0' colorQueue={colorQueues.hasOwnProperty('1v0')? Array.from(colorQueues['1v0']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h0' colorQueue={colorQueues.hasOwnProperty('1h0')? Array.from(colorQueues['1h0']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v1' colorQueue={colorQueues.hasOwnProperty('1v1')? Array.from(colorQueues['1v1']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h1' colorQueue={colorQueues.hasOwnProperty('1h1')? Array.from(colorQueues['1h1']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v2' colorQueue={colorQueues.hasOwnProperty('1v2')? Array.from(colorQueues['1v2']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h2' colorQueue={colorQueues.hasOwnProperty('1h2')? Array.from(colorQueues['1h2']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v3' colorQueue={colorQueues.hasOwnProperty('1v3')? Array.from(colorQueues['1v3']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h3' colorQueue={colorQueues.hasOwnProperty('1h3')? Array.from(colorQueues['1h3']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v4' colorQueue={colorQueues.hasOwnProperty('1v4')? Array.from(colorQueues['1v4']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h4' colorQueue={colorQueues.hasOwnProperty('1h4')? Array.from(colorQueues['1h4']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v5' colorQueue={colorQueues.hasOwnProperty('1v5')? Array.from(colorQueues['1v5']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h5' colorQueue={colorQueues.hasOwnProperty('1h5')? Array.from(colorQueues['1h5']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v6' colorQueue={colorQueues.hasOwnProperty('1v6')? Array.from(colorQueues['1v6']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h6' colorQueue={colorQueues.hasOwnProperty('1h6')? Array.from(colorQueues['1h6']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v7' colorQueue={colorQueues.hasOwnProperty('1v7')? Array.from(colorQueues['1v7']) : []} orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='2v0' colorQueue={colorQueues.hasOwnProperty('2v0')? Array.from(colorQueues['2v0']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h0' colorQueue={colorQueues.hasOwnProperty('2h0')? Array.from(colorQueues['2h0']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v1' colorQueue={colorQueues.hasOwnProperty('2v1')? Array.from(colorQueues['2v1']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h1' colorQueue={colorQueues.hasOwnProperty('2h1')? Array.from(colorQueues['2h1']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v2' colorQueue={colorQueues.hasOwnProperty('2v2')? Array.from(colorQueues['2v2']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h2' colorQueue={colorQueues.hasOwnProperty('2h2')? Array.from(colorQueues['2h2']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v3' colorQueue={colorQueues.hasOwnProperty('2v3')? Array.from(colorQueues['2v3']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h3' colorQueue={colorQueues.hasOwnProperty('2h3')? Array.from(colorQueues['2h3']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v4' colorQueue={colorQueues.hasOwnProperty('2v4')? Array.from(colorQueues['2v4']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h4' colorQueue={colorQueues.hasOwnProperty('2h4')? Array.from(colorQueues['2h4']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v5' colorQueue={colorQueues.hasOwnProperty('2v5')? Array.from(colorQueues['2v5']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h5' colorQueue={colorQueues.hasOwnProperty('2h5')? Array.from(colorQueues['2h5']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v6' colorQueue={colorQueues.hasOwnProperty('2v6')? Array.from(colorQueues['2v6']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h6' colorQueue={colorQueues.hasOwnProperty('2h6')? Array.from(colorQueues['2h6']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v7' colorQueue={colorQueues.hasOwnProperty('2v7')? Array.from(colorQueues['2v7']) : []} orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='3v0' colorQueue={colorQueues.hasOwnProperty('3v0')? Array.from(colorQueues['3v0']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h0' colorQueue={colorQueues.hasOwnProperty('3h0')? Array.from(colorQueues['3h0']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v1' colorQueue={colorQueues.hasOwnProperty('3v1')? Array.from(colorQueues['3v1']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h1' colorQueue={colorQueues.hasOwnProperty('3h1')? Array.from(colorQueues['3h1']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v2' colorQueue={colorQueues.hasOwnProperty('3v2')? Array.from(colorQueues['3v2']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h2' colorQueue={colorQueues.hasOwnProperty('3h2')? Array.from(colorQueues['3h2']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v3' colorQueue={colorQueues.hasOwnProperty('3v3')? Array.from(colorQueues['3v3']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h3' colorQueue={colorQueues.hasOwnProperty('3h3')? Array.from(colorQueues['3h3']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v4' colorQueue={colorQueues.hasOwnProperty('3v4')? Array.from(colorQueues['3v4']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h4' colorQueue={colorQueues.hasOwnProperty('3h4')? Array.from(colorQueues['3h4']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v5' colorQueue={colorQueues.hasOwnProperty('3v5')? Array.from(colorQueues['3v5']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h5' colorQueue={colorQueues.hasOwnProperty('3h5')? Array.from(colorQueues['3h5']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v6' colorQueue={colorQueues.hasOwnProperty('3v6')? Array.from(colorQueues['3v6']) : []} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h6' colorQueue={colorQueues.hasOwnProperty('3h6')? Array.from(colorQueues['3h6']) : []} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v7' colorQueue={colorQueues.hasOwnProperty('3v7')? Array.from(colorQueues['3v7']) : []} orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='4v0' colorQueue={colorQueues.hasOwnProperty('4v0')? Array.from(colorQueues['4v0']) : []} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h0' colorQueue={colorQueues.hasOwnProperty('4h0')? Array.from(colorQueues['4h0']) : []} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v1' colorQueue={colorQueues.hasOwnProperty('4v1')? Array.from(colorQueues['4v1']) : []} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h1' colorQueue={colorQueues.hasOwnProperty('4h1')? Array.from(colorQueues['4h1']) : []} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v2' colorQueue={colorQueues.hasOwnProperty('4v2')? Array.from(colorQueues['4v2']) : []} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h2' colorQueue={colorQueues.hasOwnProperty('4h2')? Array.from(colorQueues['4h2']) : []} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v3' colorQueue={colorQueues.hasOwnProperty('4v3')? Array.from(colorQueues['4v3']) : []} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h3' colorQueue={colorQueues.hasOwnProperty('4h3')? Array.from(colorQueues['4h3']) : []} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v4' colorQueue={colorQueues.hasOwnProperty('4v4')? Array.from(colorQueues['4v4']) : []} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h4' colorQueue={colorQueues.hasOwnProperty('4h4')? Array.from(colorQueues['4h4']) : []} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v5' colorQueue={colorQueues.hasOwnProperty('4v5')? Array.from(colorQueues['4v5']) : []} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h5' colorQueue={colorQueues.hasOwnProperty('4h5')? Array.from(colorQueues['4h5']) : []} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v6' colorQueue={colorQueues.hasOwnProperty('4v6')? Array.from(colorQueues['4v6']) : []} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h6' colorQueue={colorQueues.hasOwnProperty('4h6')? Array.from(colorQueues['4h6']) : []} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v7' colorQueue={colorQueues.hasOwnProperty('4v7')? Array.from(colorQueues['4v7']) : []} orientation="vertical" lastRow = {true} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    position: 'absolute'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
});

export default GridComponent;