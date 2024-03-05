import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, useWindowDimensions } from 'react-native';
import WireFrame from './wireframe/WireFrame';
import TaskModel from '../../models/TaskModel';
import moment from 'moment';
import { useFonts, Inter_900Black } from '@expo-google-fonts/inter';

interface Tasks {
    tasks: TaskModel[]; // Only root tasks
}

const Main: React.FC<Tasks> = ({ tasks }) => {

    const windowHeight = useWindowDimensions().height;

    const currentMonthAndYear = moment().format('MMMM YYYY');
    let [fontsLoaded] = useFonts({
        Inter_900Black
      });

    return (
        <ScrollView style={{width:"100%"}}>
          <Text style={{color:'white', fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', fontSize:60, marginHorizontal:'9%', paddingTop:80}}>{currentMonthAndYear}</Text>
          <View style={[styles.container, {height: windowHeight * 0.95}]}>
            <WireFrame tasks={[]}/>
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