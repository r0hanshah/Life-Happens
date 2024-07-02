import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';

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