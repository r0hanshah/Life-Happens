import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import WireFrame from './wireframe/WireFrame';
import TaskModel from '../../models/TaskModel';
import moment from 'moment';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

interface Tasks {
    rootTasks: TaskModel[]; // Only root tasks
}

const Main: React.FC<Tasks> = ({ rootTasks }) => { //TODO: Pass in moment to wireframe and downstream that information

    const windowHeight = useWindowDimensions().height;
    const [leafNodesMap, setLeafNodesMap] = useState<{[key:string]:TaskModel[]}>({});

    const currentMonthAndYear = moment().format('MMMM YYYY');
    let [fontsLoaded] = useFonts({
        Inter_900Black
      });
    
    // Extract leaf nodes from root tasks with breadth first search
    const getAllLeafNodes=(rootTasks:TaskModel[]):{ [key: string]: TaskModel[]} =>
    {
      var allLeafNodes:{[key:string]:TaskModel[]} = {}

      for(const rootTask of rootTasks)
      {
        //TODO: Have bfsTree return all leaf nodes but also a '1' (left bound) or '0' (right bound) based on the day of the week each leaf node is given
        //TODO: Include that value as part of the id so you can then extract it
        allLeafNodes[rootTask.id] = bfsTree(rootTask)
      }

      return allLeafNodes
    }

    const bfsTree=(root:TaskModel):TaskModel[] =>
    {
      var q:TaskModel[] = []
      var leafNodes:TaskModel[] = []

      q.push(root)

      while(q.length != 0)
      {
        var observedNode = q[0]
        if(observedNode.children.length == 0)
        {
          leafNodes.push(observedNode)
        }
        else
        {
          for(const child of observedNode.children)
          {
            q.push(child)
          }
        }
        q.slice(1)
      }

      return leafNodes
    }

    // Set all leaf nodes
    useEffect(() => {
      const allLeafNodes = getAllLeafNodes(rootTasks)
      setLeafNodesMap(allLeafNodes);
    }, [rootTasks]);


    return (
        <ScrollView style={{width:"100%"}}>
          <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:'9%', paddingTop:80}}>{currentMonthAndYear}</Text>
          <View style={[styles.container, {height: windowHeight * 0.95}]}>
            <WireFrame leafNodesMap={leafNodesMap}/>
            {/* <>
              {currentScreen === 'Login' && <LoginScreen navigateToSignUp={navigateToSignUp} />}
              {currentScreen === 'SignUp' && <SignUpScreen navigateBack={navigateBack} />}
            </> */}
          </View>
          <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:'9%', paddingTop:80}}>Root Tasks</Text>
        </ScrollView>
      );
}

const styles = StyleSheet.create({
    container: {
      maxWidth: 'auto',
      backgroundColor: '#151515',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Main