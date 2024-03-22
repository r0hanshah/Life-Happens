import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import { useFonts, Inter_500Medium } from '@expo-google-fonts/inter';
import TaskModel from '../../../models/TaskModel';

interface ListItemProps
{
    rootTask: TaskModel
    leftBound: boolean
    index:number
}

const ListItem: React.FC<ListItemProps> = ({ rootTask, leftBound, index }) => 
{
    const windowWidth = useWindowDimensions().width;

    let [fontsLoaded] = useFonts({
        Inter_500Medium
      });

    return (
        <View key={rootTask.id} style={{height: 50, width: "auto", flexDirection: "row", overflow:"visible", marginBottom: 10, justifyContent: leftBound ? "flex-start" : "flex-end"}}>

            {/* <View style={{width: 2, height: 195 + index * 60, backgroundColor: rootTask.color, bottom: 168 + index * 60, display: leftBound ? "flex": "none"}}/> */}
            <View style={{width: windowWidth*0.018, height: 2, backgroundColor: rootTask.color, marginTop: 25, marginLeft:1, display: leftBound ? "flex": "none"}}/>

            <View style={[styles.container, {width: windowWidth * 0.395, justifyContent: leftBound ? "flex-start" : "flex-end"}]}>

                <View style={[styles.circle, {backgroundColor: rootTask.color, display: leftBound ? "flex": "none"}]}/>

                <Text style={{
                    color: '#fff',
                    fontFamily: fontsLoaded ? 'Inter_500Medium' : 'Arial'
                }}>{rootTask.title}</Text>

                <View style={[styles.circle, {backgroundColor: rootTask.color, display: !leftBound ? "flex": "none"}]}/>

            </View>

            <View style={{width: windowWidth*0.018, height: 2, backgroundColor: rootTask.color, marginTop: 25, marginRight:1, display: !leftBound ? "flex": "none"}}/>
            {/* <View style={{width: 2, height: 195 + index * 60, backgroundColor: rootTask.color, bottom: 168 + index * 60, display: !leftBound ? "flex": "none"}}/> */}

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#383838',
      alignItems: 'center',
      borderRadius: 25,
      height: 50
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 20,
        marginHorizontal: 20
    }
  }); 

export default ListItem