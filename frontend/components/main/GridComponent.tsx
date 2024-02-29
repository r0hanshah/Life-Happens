import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BorderComponent from './BorderComponent';

interface GridProps {
  offset: number;
  subtaskDispIds: string[]; // Hexcode,id|||path_rootid===inter_row,inter_column:::path_id===row,column,index,left_bound // TODO: Change to date with task id and then do more preprocessing
                            // Ideally, the leaf tasks of the root tasks will be passed together
}

const GridComponent: React.FC<GridProps> = ({ offset, subtaskDispIds }) => {

  const [colorQueues, setColorQueues] = useState({});

  // useEffect to compute the value when myParameter changes
  useEffect(() => {
    const computedResult = generatePathsForIds(subtaskDispIds);
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
        throw new Error('Feature not supported yet')
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
          while(leftBound ? columnOffset > 0 : columnOffset < 6)
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
        <BorderComponent id='0v0' colorQueue={[['red',1,"lol", false],['green',0.5,"lol", false]]} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h0' colorQueue={[['red',1,"lol", true], ['green',0.5,"lol", true]]} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v1' colorQueue={[]} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h1' colorQueue={[]} orientation="horizontal" lastRow = {false}  />
 
        <BorderComponent id='0v2' colorQueue={[['red',1,"lol", false]]} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h2' colorQueue={[]} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v3' colorQueue={[['red',1,"lol", false]]} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h3' colorQueue={[]} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v4' colorQueue={[]} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h4' colorQueue={[['red',1,"lol", false]]} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v5' colorQueue={[]} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h5' colorQueue={[]} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v6' colorQueue={[]} orientation="vertical"  lastRow = {false} />
        <BorderComponent id='0h6' colorQueue={[]} orientation="horizontal" lastRow = {false}  />

        <BorderComponent id='0v7' colorQueue={[]} orientation="vertical"  lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='1v0' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h0' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v1' colorQueue={[['red',1,"lol", false]]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h1' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v2' colorQueue={[['red',1,"lol", false]]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h2' colorQueue={[['red',1,"lol", false]]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v3' colorQueue={[['red',1,"lol", false]]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h3' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v4' colorQueue={[['red',1,"lol", false]]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h4' colorQueue={[['red',1,"lol", false]]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v5' colorQueue={[['red',1,"lol", false]]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h5' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v6' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='1h6' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='1v7' colorQueue={[]} orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='2v0' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h0' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v1' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h1' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v2' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h2' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v3' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h3' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v4' colorQueue={[['red',1,"lol", false]]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h4' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v5' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h5' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v6' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='2h6' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='2v7' colorQueue={[]} orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='3v0' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h0' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v1' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h1' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v2' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h2' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v3' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h3' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v4' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h4' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v5' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h5' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v6' colorQueue={[]} orientation="vertical" lastRow = {false} />
        <BorderComponent id='3h6' colorQueue={[]} orientation="horizontal" lastRow = {false} />

        <BorderComponent id='3v7' colorQueue={[]} orientation="vertical" lastRow = {false} />
      </View>
      <View style={styles.row}>
        <BorderComponent id='4v0' colorQueue={[]} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h0' colorQueue={[]} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v1' colorQueue={[]} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h1' colorQueue={[]} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v2' colorQueue={[]} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h2' colorQueue={[]} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v3' colorQueue={[]} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h3' colorQueue={[]} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v4' colorQueue={[]} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h4' colorQueue={[]} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v5' colorQueue={[]} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h5' colorQueue={[]} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v6' colorQueue={[]} orientation="vertical" lastRow = {true} />
        <BorderComponent id='4h6' colorQueue={[]} orientation="horizontal" lastRow = {true} />

        <BorderComponent id='4v7' colorQueue={[]} orientation="vertical" lastRow = {true} />
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