import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import Main from './components/main/Main';

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
      {/* <CalendarComponent /> */}
      <Main tasks={[]}/>
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
