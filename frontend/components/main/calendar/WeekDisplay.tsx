import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';
import DayNode from './DayNode';
import moment from 'moment';
import TaskModel from '../../../models/TaskModel';
import MainController from '../../../controllers/main/MainController';

interface WeekProps {
    dayNodes: React.JSX.Element[];
}

// start date and get week of that date and tasks for that week

const WeekDisplay: React.FC<WeekProps> = ({dayNodes}) => {
    return(
        <View style={{backgroundColor:'#151515', height:'100%'}}>
            <View style={{flexDirection:'row', justifyContent:'space-around', marginVertical:10}}>
                {dayNodes}
            </View>
        </View>
    )
}

export default WeekDisplay