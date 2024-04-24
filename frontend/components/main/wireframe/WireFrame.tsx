import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GridComponent from './GridComponent';
import ParentNodeGridComponent from './ParentCircleGrid';
import CalendarDisplay from '../calendar/CalendarDisplay';
import TaskModel from '../../../models/TaskModel';
import moment from 'moment';



interface WireFrameProps {
    leafNodesMap: {[key:string]:TaskModel[]};
    sidedRootTasksMap: {[key:string]:TaskModel[]};
    inMoment: moment.Moment;
}

const WireFrame: React.FC<WireFrameProps> = ({ leafNodesMap, sidedRootTasksMap, inMoment }) => {
    // Produce ids for leaf nodes and their parents
    const [leafIds, setLeafIds] = useState<{ [key: number]: string[] }>({});
    const [parentNodeIds, setParentNodeIds] = useState<{ [key: number]: string[] }>({})
    const [leafTaskByIndex, setLeafTaskByIndex] = useState<{ [key: number]: TaskModel[] }>({})
    const [parentTaskByWireFrame, setParentTaskByWireframe] = useState<{[key: number]: TaskModel[]}>({})

    const [currentMonth, setCurrentMonth] = useState(inMoment);

    useEffect(()=>{
        console.log("Updating date from wireframe")
        setCurrentMonth(moment(inMoment))
    }, [inMoment])

    // Generate values for all parameters above
    const generateLeafAndParentNodeIds = (leafNodesMap:{[key:string]:TaskModel[]}):[{ [key: number]: string[] }, { [key: number]: string[] }, { [key: number]: TaskModel[] }, { [key: number]: TaskModel[] }] =>
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
        var parentTaskByWireFrame:{ [key: number]: TaskModel[] } = {}
        var leafTaskByIndex:{ [key: number]: TaskModel[] } = {}

        var offsetMap: { [key:number] : number} = {}
        
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
                
                // Get Priority
                var priority:number = 1

                for(var leafNode of sortedLeafNodes)
                {
                    leafNode.offset = offset
                    // Get color
                    const color = leafNode.color

                    // Get Parent id
                    const parentTask = leafNode.ancestors.length > 0 ? leafNode.ancestors[0] : null
                    const parentId = leafNode.ancestors.length > 0 ? leafNode.ancestors[0].id == leafNode.rootId ? "" : leafNode.ancestors[0].id : ""

                    // Get row and column from start date
                    const momentOfStatrDate = moment(leafNode.startDate)

                    const daysFromStartDay = momentOfStatrDate.dayOfYear() - startDay.dayOfYear()

                    var index = priority

                    offsetMap.hasOwnProperty(daysFromStartDay) ? index += offsetMap[daysFromStartDay] : offsetMap[daysFromStartDay] = 0

                    index = offsetMap[daysFromStartDay] + 1

                    offsetMap[daysFromStartDay] += 1

                    leafTaskByIndex.hasOwnProperty(daysFromStartDay) ? leafTaskByIndex[daysFromStartDay].push(leafNode) :  leafTaskByIndex[daysFromStartDay] = [leafNode]

                    const row:number = daysFromStartDay <= numberOfDaysBetween && daysFromStartDay >= 0 ? Math.floor((daysFromStartDay)/7) : daysFromStartDay > numberOfDaysBetween? 999 : -1
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
                            console.log("gettting parent indexes")
                            const latestChild = children.reduce((max, child) => (child.startDate.toISOString() >= max.startDate.toISOString() ? child : max), children[0]);

                            
                            const momentOfLatestStatrDate = moment(latestChild.startDate)

                            const daysFromLatestStartDay = momentOfLatestStatrDate.dayOfYear() - startDay.dayOfYear()

                            pRow = daysFromLatestStartDay <= numberOfDaysBetween && daysFromLatestStartDay >= 0 ? Math.floor((daysFromLatestStartDay)/7) : daysFromLatestStartDay > numberOfDaysBetween? 999 : -1
                            pColumn = daysFromLatestStartDay <= numberOfDaysBetween && daysFromLatestStartDay >= 0 ? daysFromLatestStartDay % 7 : daysFromLatestStartDay > numberOfDaysBetween ? 999 : -1



                            // Parent node will be placed one behind (left bound) or 2 infront (right bound) of the latest Child
                            // const momentOfStatrDate = moment(latestChild.startDate)
                            // const daysFromStartDay = momentOfStatrDate.dayOfYear() - startDay.dayOfYear()
                            // console.log(daysFromStartDay)

                            // pRow = daysFromStartDay <= numberOfDaysBetween && daysFromStartDay >= 0 ? Math.floor(daysFromStartDay/numberOfColumns) : daysFromStartDay > numberOfDaysBetween? 999 : -1

                            // pColumn = daysFromStartDay <= numberOfDaysBetween && daysFromStartDay >= 0 ? daysFromStartDay % 7 + (daysFromStartDay % 7 == 0 && leftBound == "1"? 1 : daysFromStartDay % 7 == 6 && leftBound == "0"? - 1 : leftBound == "1" ? -1 : 2) : daysFromStartDay > numberOfDaysBetween ? 999 : -1

                            pColumn += leftBound == "1" ? 0 : 1
                            console.log("parent row and col", pRow, pColumn)
                            parentCache[parentId] = [pRow, pColumn]
                        }
                    }
                    
                    var rootIndex = 0
                    for(var i = 0; i < sidedRootTasksMap[leftBound].length; i += 1)
                    {
                        const rootTask = sidedRootTasksMap[leftBound][i]
                        if (rootTask.id == rootId)
                        {
                            rootIndex = i
                            break
                        }
                    }
                    

                    // Create Leaf Id and parent node id
                    const leafId:string = `${color},${rootId},${rootIndex}|||${parentId.length > 0? parentId +'==='+ pRow + ',' + pColumn + ':::' : ''}${leafNode.id}===${row},${column},${index},${leftBound}`

                    // Place ids in dictionary
                    leafIdsByWireFrame.hasOwnProperty(offset) ? leafIdsByWireFrame[offset].push(leafId) : leafIdsByWireFrame[offset] = [leafId]

                    parentId.length > 0 ? parentNodeIdsByWireFrame.hasOwnProperty(offset) ? parentNodeIdsByWireFrame[offset].push(`${pRow},${pColumn},${color}`) : parentNodeIdsByWireFrame[offset] = [`${pRow},${pColumn},${color}`]  : console.log(`This child ${leafNode.id} is orphaned`)
                    parentTask ? parentTaskByWireFrame.hasOwnProperty(offset) ? parentTaskByWireFrame[offset].push(parentTask) : parentTaskByWireFrame[offset] = [parentTask]  : console.log(`b/c no parent was found`)
                
                    // Increase priority
                    priority += 1
                }

                // Up the counter
                count += 1
            }
        }
        return [leafIdsByWireFrame, parentNodeIdsByWireFrame, leafTaskByIndex, parentTaskByWireFrame]
    }

    useEffect(() => {
        const computedResult = generateLeafAndParentNodeIds(leafNodesMap);
        setLeafIds(computedResult[0])
        setParentNodeIds(computedResult[1])
        setLeafTaskByIndex(computedResult[2])
        setParentTaskByWireframe(computedResult[3])
      }, [leafNodesMap])

    return (
        <View style={styles.container}>
            <GridComponent offset={0} subtaskDispIds={leafIds.hasOwnProperty(0) ? leafIds[0]: []} inMoment={inMoment}/>
            <GridComponent offset={1} subtaskDispIds={leafIds.hasOwnProperty(1) ? leafIds[1]: []} inMoment={inMoment}/>
            <GridComponent offset={2} subtaskDispIds={leafIds.hasOwnProperty(2) ? leafIds[2]: []} inMoment={inMoment}/>

            <ParentNodeGridComponent offset={0} parentNodeIds={parentNodeIds.hasOwnProperty(0) ? parentNodeIds[0]: []} parentTasks={parentTaskByWireFrame.hasOwnProperty(0) ? parentTaskByWireFrame[0] : [] } inMoment={inMoment}/>
            <ParentNodeGridComponent offset={1} parentNodeIds={parentNodeIds.hasOwnProperty(1) ? parentNodeIds[1]: []} parentTasks={parentTaskByWireFrame.hasOwnProperty(1) ? parentTaskByWireFrame[1] : [] } inMoment={inMoment}/>
            <ParentNodeGridComponent offset={2} parentNodeIds={parentNodeIds.hasOwnProperty(2) ? parentNodeIds[2]: []} parentTasks={parentTaskByWireFrame.hasOwnProperty(2) ? parentTaskByWireFrame[2] : [] } inMoment={inMoment}/>

            <CalendarDisplay offset={0} leafNodesMap={leafTaskByIndex} inMoment={inMoment}/>
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
