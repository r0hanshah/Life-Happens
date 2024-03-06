import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import GridComponent from './GridComponent';
import ParentNodeGridComponent from './ParentCircleGrid';
import CalendarDisplay from '../calendar/CalendarDisplay';
import TaskModel from '../../../models/TaskModel';
import moment from 'moment';

// TODO: Pass in moment to components inside the wireframe

interface WireFrameProps {
    leafNodesMap: {[key:string]:TaskModel[]};
    // Have moment from main view here
}

const WireFrame: React.FC<WireFrameProps> = ({ leafNodesMap }) => {
    // Produce ids for leaf nodes and their parents
    const [leafIds, setLeafIds] = useState<{ [key: number]: string[] }>({});
    const [parentNodeIds, setParentNodeIds] = useState<{ [key: number]: string[] }>({})
    const [allLeafNodes, setAllLeafNodes] = useState<TaskModel[]>([])

    const [currentMonth, setCurrentMonth] = useState(moment());

    // Generate values for all parameters above
    const generateLeafAndParentNodeIds = (leafNodesMap:{[key:string]:TaskModel[]}):[{ [key: number]: string[] }, { [key: number]: string[] }, TaskModel[]] =>
    {
        const firstDayOfMonth = currentMonth.clone().startOf('month');
        const daysInMonth = currentMonth.daysInMonth();

        // These will be useful when determining what column and what row value to give your id
        const startDay = firstDayOfMonth.clone().startOf('week');
        const endDay = firstDayOfMonth.clone().endOf('month').endOf('week');


        var leafIdsByWireFrame:{ [key: number]: string[] } = {}
        var parentNodeIdsByWireFrame:{ [key: number]: string[] } = {}
        var allLeafNodes:TaskModel[] = []
        
        var count:number = 0
        // Iterate through each key value in leafNodesMap

        for(const key in leafNodesMap)
        {
            // Set which wireframe leaf tasks will belong to
            const offset = count % 3

            // Extract side bound from key value by looking for separator ':::'

            if (leafNodesMap.hasOwnProperty(key)) 
            {
                // Sort all leaf nodes for parent by start Date

                // Add leaf nodes to allLeafNodes
                allLeafNodes.concat(leafNodesMap[key])

                // Determine if task is left bound or right bound
                
                // Get Priority


                var priority:number = 0

                for(const leafNode of leafNodesMap[key])
                {
                    // Get color

                    // Get Parent id

                    // Get row and column from 
                }

                // Up the counter
                count += 1
            }
        }

        return [leafIdsByWireFrame, parentNodeIdsByWireFrame, allLeafNodes]
    }

    return (
        <View style={styles.container}>
            <GridComponent offset={0} subtaskDispIds={["red,lol|||loll===0,2,1,1", "green,lol|||loll===2,2,3,0", "purple,lol|||loll===3,4:::loll===1,4,3,0"]} />
            <GridComponent offset={1} subtaskDispIds={["yellow,lol|||loll===0,2,2,1"]}/>
            <GridComponent offset={2} subtaskDispIds={["orange,lol|||loll===0,2,3,1","#fff,lol|||loll===1,4,5,1"]}/>

            <ParentNodeGridComponent offset={0} parentNodes={['0,0,red', '3,3,purple']}/>
            <ParentNodeGridComponent offset={1} parentNodes={['0,0,yellow']}/>
            <ParentNodeGridComponent offset={2} parentNodes={['0,0,orange']}/>

            <CalendarDisplay offset={0} leafNodes={allLeafNodes}></CalendarDisplay>
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
