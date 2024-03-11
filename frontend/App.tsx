import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import Main from './components/main/Main';
import TaskModel from './models/TaskModel';
import LandingScreen from './components/landing/LandingScreen';


export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'SignUp' | 'Landing'>('Landing');

  const navigateToSignUp = () => {
    setCurrentScreen('SignUp');
  };
  const navigateBack = () => {
    setCurrentScreen('Login');
  };
  const navigateToLogin = () => {
    setCurrentScreen('Login');
  };
  const navigateToLanding = () => {
    setCurrentScreen('Landing');
  };
  return (
        <View style={styles.container}>
          {currentScreen === 'Landing' && <LandingScreen navigateToSignUp={navigateToSignUp} navigateToLogin={navigateToLogin} navigateToLanding={navigateToLanding}/>}
          <View style={styles.signupLoginContainer}>
            {/* <CalendarComponent /> */}
            {/*<Main rootTasks={[
              new TaskModel("123", "dp", "123", [], [], "Test Root Task", "red", [], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
              new TaskModel("123", "dp", "123", [], [], "More Test", "yellow", [], [], "2024-03-11T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
              new TaskModel("123", "dp", "123", [], [], "One More Test", "green", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
            ]}/>*/}
             <>
        {currentScreen === 'Login' && <LoginScreen navigateToSignUp={navigateToSignUp} />}
        {currentScreen === 'SignUp' && <SignUpScreen navigateBack={navigateBack} />}
      </> 
            <StatusBar style="auto" />
          </View>
        </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  signupLoginContainer:{
    alignItems: 'center',
    justifyContent: 'center',

  },

});
