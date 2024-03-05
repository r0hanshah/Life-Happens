import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BorderComponent from './BorderComponent';
import moment from 'moment';

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
  const [currentMonth, setCurrentMonth] = useState(moment());

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

        // Leaf Node
        const leafPathIdAndPlacementInfo = parentAndLeaf[1].split('===')
        const pathId = leafPathIdAndPlacementInfo[0]
        const rowColumnIndex = leafPathIdAndPlacementInfo[1].split(',')

        const lRow = parseInt(rowColumnIndex[0], 10)
        const lColumn = parseInt(rowColumnIndex[1], 10)
        const lIndex = parseInt(rowColumnIndex[2], 10)
        const leftBound:boolean = rowColumnIndex[3] == '1'

        const prioritized:boolean = lIndex <= 3

        // Draw wire from leaf to parent
        if (prioritized)
        {
          // Draw first wire
          if(colorQueuesMap.hasOwnProperty(`${lRow}h${lColumn}`))
          {
            colorQueuesMap[`${lRow}h${lColumn}`].add([hexcode, 0.25 * lIndex, rootId, lColumn >= pColumn])
          }
          else
          {
            colorQueuesMap[`${lRow}h${lColumn}`] = new Set([[hexcode, 0.25 * lIndex, rootId, lColumn >= pColumn]])
          }


          // Draw vertical lines
          var rowOffset:number = lRow + (pRow < lRow ? 1 : 0)
          while(lRow < pRow ? rowOffset < pRow : rowOffset > pRow)
          {
            lRow < pRow ? rowOffset += 1 : rowOffset -= 1

            if(pRow == rowOffset && pRow <= lRow) { break }

            if(colorQueuesMap.hasOwnProperty(`${rowOffset}v${lColumn + (pColumn > lColumn ? 1 : 0)}`))
            {
              colorQueuesMap[`${rowOffset}v${lColumn + (pColumn > lColumn ? 1 : 0)}`].add([hexcode, 1, rootId, lColumn <= pColumn])
            }
            else
            {
              colorQueuesMap[`${rowOffset}v${lColumn + (pColumn > lColumn ? 1 : 0)}`] = new Set([[hexcode, 1, rootId, lColumn <= pColumn]])
            }
          }

          // Draw horizontal lines
          var columnOffset:number = lColumn
          while(lColumn < pColumn ? columnOffset < pColumn : columnOffset >= pColumn)
          {
            lColumn < pColumn  ? columnOffset += 1 : columnOffset -= 1;

            if(pColumn == columnOffset && pColumn <= lColumn || pColumn - 1 == columnOffset && pColumn > lColumn) { break }

            if(colorQueuesMap.hasOwnProperty(`${rowOffset}h${columnOffset}`))
            {
              colorQueuesMap[`${rowOffset}h${columnOffset}`].add([hexcode, 1, rootId, leftBound])
            }
            else
            {
              colorQueuesMap[`${rowOffset}h${columnOffset}`] = new Set([[hexcode, 1, rootId, leftBound]])
            }
          }

          // Draw lines from parent circle to root task
          // Draw horizontal wires
          columnOffset = pColumn > lColumn ? lColumn : columnOffset
          while(leftBound? columnOffset > 0 : columnOffset < 7)
          {
            leftBound ? columnOffset -= 1 : columnOffset += 1;
            if(colorQueuesMap.hasOwnProperty(`${rowOffset}h${columnOffset}`))
            {
              colorQueuesMap[`${rowOffset}h${columnOffset}`].add([hexcode, 1, rootId, leftBound])
            }
            else
            {
              colorQueuesMap[`${rowOffset}h${columnOffset}`] = new Set([[hexcode, 1, rootId, leftBound]])
            }
          }

          // Draw vertical wires
          while(rowOffset < 5)
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
          // Draw first vertical line
          var amountFill = lIndex % 3
          amountFill == 0 ? amountFill += 3 : amountFill += 0

          var columnOffset = lIndex % 2 == 0 ? lColumn : lColumn + 1
          if(colorQueuesMap.hasOwnProperty(`${lRow}v${columnOffset}`))
          {
            colorQueuesMap[`${lRow}v${columnOffset}`].add([hexcode, 0.25 * amountFill, rootId, leftBound])
          }
          else
          {
            colorQueuesMap[`${lRow}v${columnOffset}`] = new Set([[hexcode, 0.25 * amountFill, rootId, leftBound]])
          }

          // Draw horizontal lines towards parent
          var rowOffset:number = lRow

          columnOffset -=  lColumn < pColumn ? 1 : 0

          while(lColumn < pColumn ? columnOffset < pColumn : columnOffset >= pColumn)
          {
            lColumn < pColumn  ? columnOffset += 1 : columnOffset -= 1;

            if(pColumn  == columnOffset-1 && pColumn <= lColumn || pColumn - 1 == columnOffset && pColumn > lColumn) { break }
            
            if(colorQueuesMap.hasOwnProperty(`${rowOffset}h${columnOffset}`))
            {
              colorQueuesMap[`${rowOffset}h${columnOffset}`].add([hexcode, 1, rootId, leftBound])
            }
            else
            {
              colorQueuesMap[`${rowOffset}h${columnOffset}`] = new Set([[hexcode, 1, rootId, leftBound]])
            }
          }

          rowOffset = lRow + (pRow < lRow ? 1 : 0)
          // Draw vertical lines towards parent
          while(lRow < pRow ? rowOffset < pRow : rowOffset > pRow)
          {
            lRow < pRow ? rowOffset += 1 : rowOffset -= 1

            if(pRow == rowOffset && pRow <= lRow) { break }
            
            if(colorQueuesMap.hasOwnProperty(`${rowOffset}v${columnOffset}`))
            {
              colorQueuesMap[`${rowOffset}v${columnOffset}`].add([hexcode, 1, rootId, lColumn <= pColumn])
            }
            else
            {
              colorQueuesMap[`${rowOffset}v${columnOffset}`] = new Set([[hexcode, 1, rootId, lColumn <= pColumn]])
            }
          }

          // Draw horizontal lines to root
          while(leftBound? columnOffset > 0 : columnOffset < 7)
          {
            leftBound ? columnOffset -= 1 : columnOffset += 1;
            if(colorQueuesMap.hasOwnProperty(`${rowOffset}h${columnOffset}`))
            {
              colorQueuesMap[`${rowOffset}h${columnOffset}`].add([hexcode, 1, rootId, leftBound])
            }
            else
            {
              colorQueuesMap[`${rowOffset}h${columnOffset}`] = new Set([[hexcode, 1, rootId, leftBound]])
            }
          }

          // Draw vertical lines towards root
          while(rowOffset < 5)
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
          while(rowOffset < 5)
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
          var amountFill = index % 3
          amountFill == 0 ? amountFill += 3 : amountFill += 0
          var columnOffset = index % 2 == 0 ? column : column + 1

          // Draw first column line
          if(colorQueuesMap.hasOwnProperty(`${row}v${columnOffset}`))
          {
            colorQueuesMap[`${row}v${columnOffset}`].add([hexcode, 0.25 * amountFill, rootId, leftBound])
          }
          else
          {
            colorQueuesMap[`${row}v${columnOffset}`] = new Set([[hexcode, 0.25 * amountFill, rootId, leftBound]])
          }

          // Draw horizontal lines
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
          while(rowOffset < 5)
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
      }
      else
      {
        throw new Error(`Unexpected data format in id: ${id}`);
      }
    }
    


    return colorQueuesMap;
  };

  const renderBorderComponents = (colorQueues: any) => {
    const firstDayOfMonth = currentMonth.clone().startOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = firstDayOfMonth.clone().startOf('week');
    const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');

    const daysDifference = endDay.diff(startDay, 'days');

    const columns = 7;
    const components = [];
    for(var row = 0; row < daysDifference; row+=7)
    {
      const rowComponents = [];
  
      for (let col = 0; col < columns; col++) {
        const idV = `${row/7}v${col}`;
        const idH = `${row/7}h${col}`;
  
        rowComponents.push(
          <React.Fragment key={idV + idH}>
            <BorderComponent id={idV} colorQueue={colorQueues.hasOwnProperty(idV) ? Array.from(colorQueues[idV]) : []} orientation="vertical" lastRow={row/7 == Math.ceil(daysDifference/7 - 1)} />
            <BorderComponent id={idH} colorQueue={colorQueues.hasOwnProperty(idH) ? Array.from(colorQueues[idH]) : []} orientation="horizontal" lastRow={row/7 == Math.ceil(daysDifference/7 - 1)} />
          </React.Fragment>
        );
      }

      rowComponents.push(
        <React.Fragment key={`lastColumn${row/7}`}>
            <BorderComponent id={`${row/7}v${7}`} colorQueue={colorQueues.hasOwnProperty(`${row/7}v${7}`) ? Array.from(colorQueues[`${row/7}v${7}`]) : []} orientation="vertical" lastRow={row/7 == Math.ceil(daysDifference/7 - 1)} />
        </React.Fragment>
      )
  
      components.push(
        <View key={row} style={styles.row}>
          {rowComponents}
        </View>
      );
    }

    return components;
  };



  return (
    <View style={[styles.grid, {marginTop: offset * 8}]}>
      {renderBorderComponents(colorQueues)}
      {/* Create another row only if there is not enough day modules to display all days */}
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