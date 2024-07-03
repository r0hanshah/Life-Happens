import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, useWindowDimensions } from 'react-native';

interface WeekProps {
    dayNodes: React.JSX.Element[];
}

// start date and get week of that date and tasks for that week

const WeekDisplay: React.FC<WeekProps> = ({dayNodes}) => {
    return(
        <View style={{backgroundColor:'#151515', height:'100%'}}>
            <View style={{position:'absolute', flexDirection:'column', left:-40, marginTop:50}}>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>1 AM</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>2</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>3</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>4</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>5</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>6</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>7</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>8</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>9</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>10</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>11</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>12</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>1 PM</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>2</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>3</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>4</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>5</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>6</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>7</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>8</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>9</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>10</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>11</Text>
                <Text style={{color:'#717171', textAlign:'right', marginBottom:15}}>12</Text>
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around', marginVertical:10}}>
                {dayNodes}
            </View>
        </View>
    )
}

export default WeekDisplay