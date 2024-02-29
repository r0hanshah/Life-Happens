import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import GridComponent from './components/main/GridComponent';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'SignUp'>('Login');

  const navigateToSignUp = () => {
    setCurrentScreen('SignUp');
  };

  const navigateBack = () => {
    setCurrentScreen('Login');
  };
  return (
    <View style={styles.container}>
      <GridComponent offset={0} subtaskDispIds={["red,lol|||loll===0,2,1,1", "green,lol|||loll===2,2,1,0"]} />
      <GridComponent offset={1} subtaskDispIds={[]}/>
      <GridComponent offset={2} subtaskDispIds={["#fff,lol|||loll===1,4,1,1"]}/>
      {/* <>
        {currentScreen === 'Login' && <LoginScreen navigateToSignUp={navigateToSignUp} />}
        {currentScreen === 'SignUp' && <SignUpScreen navigateBack={navigateBack} />}
      </> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151515',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
