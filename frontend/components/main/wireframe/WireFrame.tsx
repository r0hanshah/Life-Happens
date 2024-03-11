import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GridComponent from './GridComponent';
import ParentNodeGridComponent from './ParentCircleGrid';
import CalendarDisplay from '../calendar/CalendarDisplay';
import TaskModel from '../../../models/TaskModel';
import moment from 'moment';



interface WireFrameProps {
    leafNodesMap: {[key:string]:TaskModel[]};
    inMoment: moment.Moment;
}

const WireFrame: React.FC<WireFrameProps> = ({ leafNodesMap, inMoment }) => {
    // Produce ids for leaf nodes and their parents
    const [leafIds, setLeafIds] = useState<{ [key: number]: string[] }>({});
    const [parentNodeIds, setParentNodeIds] = useState<{ [key: number]: string[] }>({})
    const [allLeafNodes, setAllLeafNodes] = useState<TaskModel[]>([])

    const [currentMonth, setCurrentMonth] = useState(inMoment);

    // Generate values for all parameters above
    const generateLeafAndParentNodeIds = (leafNodesMap:{[key:string]:TaskModel[]}):[{ [key: number]: string[] }, { [key: number]: string[] }, TaskModel[]] =>
    {
        const firstDayOfMonth = currentMonth.clone().startOf('month');
        const daysInMonth = currentMonth.daysInMonth();

        // These will be useful when determining what column and what row value to give your id
        const startDay = firstDayOfMonth.clone().startOf('week');
        const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');
        const numberOfDaysBetween = endDay.diff(startDay, 'days')
        const numberOfColumns = (numberOfDaysBetween+1) / 7


        var leafIdsByWireFrame:{ [key: number]: string[] } = {}
        var parentNodeIdsByWireFrame:{ [key: number]: string[] } = {}
        var allLeafNodes:TaskModel[] = []
        
        var count:number = 0
        // Iterate through each key value in leafNodesMap

        for(const key in leafNodesMap)
        {
            // Create Parent cache for getting parent row, column
            var parentCache: {[key: string]: [number, number]} = {}

            // Set which wireframe leaf tasks will belong to
            const offset = count % 3

            // Extract side bound from key value by looking for separator ':::'
            const rootIdAndLeftBoundComponents:string[] = key.split(":::")
            const rootId = rootIdAndLeftBoundComponents[0]

            // Determine if task is left bound or right bound
            const leftBound = rootIdAndLeftBoundComponents[1]

            if (leafNodesMap.hasOwnProperty(key)) 
            {
                // Sort all leaf nodes for parent by start Date
                const sortedLeafNodes:TaskModel[] = leafNodesMap[key].sort((a, b) => a.startDate.getDate() - b.startDate.getDate())

                // Add leaf nodes to allLeafNodes
                allLeafNodes.concat(sortedLeafNodes)
                
                // Get Priority
                var priority:number = 1

                for(const leafNode of leafNodesMap[key])
                {
                    // Get color
                    const color = leafNode.color

                    // Get Parent id
                    const parentId = leafNode.ancestors.length > 0 ? leafNode.ancestors[0].id == leafNode.rootId ? "" : leafNode.ancestors[0].id : ""

                    // Get row and column from start date
                    const momentOfStatrDate = moment(leafNode.startDate)

                    const daysFromStartDay = momentOfStatrDate.dayOfYear() - startDay.dayOfYear()

                    console.log(`${daysFromStartDay} =? ${numberOfDaysBetween}`)

                    const row:number = daysFromStartDay <= numberOfDaysBetween && daysFromStartDay >= 0 ? Math.floor(daysFromStartDay/numberOfColumns)-1 : daysFromStartDay > numberOfDaysBetween? 999 : -1
                    const column:number = daysFromStartDay <= numberOfDaysBetween && daysFromStartDay >= 0 ? daysFromStartDay % 7 : daysFromStartDay > numberOfDaysBetween ? 999 : -1

                    // Get firts ancestor and calculate row and column of parent W/ Parent Cache
                    var pRow = -999
                    var pColumn = -999
                    if (parentId.length > 0)
                    {
                        if (parentCache.hasOwnProperty(leafNode.ancestors[0].id))
                        {
                            pRow = parentCache[leafNode.ancestors[0].id][0]
                            pColumn = parentCache[leafNode.ancestors[0].id][1]
                        }
                        else
                        {
                            const children = leafNode.ancestors[0].children
                            const latestChild = children.reduce((max, child) => (child.startDate.getDate() > max.startDate.getDate() ? child : max), children[0]);
                            // Parent node will be placed one behind (left bound) or 2 infront (right bound) of the latest Child
                            const daysFromStartDay = moment(latestChild.startDate).diff(startDay)

                            pRow = daysFromStartDay <= numberOfDaysBetween && daysFromStartDay >= 0 ? Math.floor(daysFromStartDay/numberOfColumns) : daysFromStartDay > numberOfDaysBetween? 999 : -1
                            pColumn = daysFromStartDay <= numberOfDaysBetween && daysFromStartDay >= 0 ? daysFromStartDay % 7 + (daysFromStartDay % 7 == 0 && leftBound == "1"? 1 : daysFromStartDay % 7 == 6 && leftBound == "0"? - 1 : leftBound == "1" ? -1 : 2) : daysFromStartDay > numberOfDaysBetween ? 999 : -1

                            parentCache[parentId] = [pRow, pColumn]
                        }
                    }
                    
                    

                    // Create Leaf Id and parent node id
                    const leafId:string = `${color},${rootId}|||${parentId.length > 0? parentId +'==='+ pRow + ',' + pColumn + ':::' : ''}${leafNode.id}===${row},${column},${priority},${leftBound}`

                    // Place ids in dictionary
                    leafIdsByWireFrame.hasOwnProperty(offset) ? leafIdsByWireFrame[offset].push(leafId) : leafIdsByWireFrame[offset] = [leafId]

                    parentId.length > 0 ? parentNodeIdsByWireFrame.hasOwnProperty(offset) ? parentNodeIdsByWireFrame[offset].push(`${pRow},${pColumn},${color}`) : parentNodeIdsByWireFrame[offset] = [`${pRow},${pColumn},${color}`]  : console.log(`This child ${leafNode.id} is orphaned`)
                
                    // Increase priority
                    priority += 1
                }

                // Up the counter
                count += 1
            }
        }
        return [leafIdsByWireFrame, parentNodeIdsByWireFrame, allLeafNodes]
    }

    useEffect(() => {
        const computedResult = generateLeafAndParentNodeIds(leafNodesMap);
        setLeafIds(computedResult[0])
        console.log(`Computed Leaf Ids: ${computedResult[0][0]}`)
        setParentNodeIds(computedResult[1])
        setAllLeafNodes(computedResult[2])
      }, [leafNodesMap])

    return (
        <View style={styles.container}>
            <GridComponent offset={0} subtaskDispIds={leafIds.hasOwnProperty(0) ? leafIds[0]: []} inMoment={inMoment}/>
            <GridComponent offset={1} subtaskDispIds={leafIds.hasOwnProperty(1) ? leafIds[1]: []} inMoment={inMoment}/>
            <GridComponent offset={2} subtaskDispIds={leafIds.hasOwnProperty(2) ? leafIds[2]: []} inMoment={inMoment}/>

            <ParentNodeGridComponent offset={0} parentNodes={parentNodeIds.hasOwnProperty(0) ? parentNodeIds[0]: []} inMoment={inMoment}/>
            <ParentNodeGridComponent offset={1} parentNodes={parentNodeIds.hasOwnProperty(1) ? parentNodeIds[1]: []} inMoment={inMoment}/>
            <ParentNodeGridComponent offset={2} parentNodes={parentNodeIds.hasOwnProperty(2) ? parentNodeIds[2]: []} inMoment={inMoment}/>

            <CalendarDisplay offset={0} leafNodes={allLeafNodes} inMoment={inMoment}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#rgba(0,0,0,0)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default WireFrame
