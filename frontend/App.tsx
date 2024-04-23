import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import Main from './components/main/Main';
import TaskModel from './models/TaskModel';
import LandingScreen from './components/landing/LandingScreen';
import ButtonTest from './components/buttonTest/ButtonTest'; // Import the ButtonTest component



export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'SignUp' | 'Landing' | 'ButtonTest' | 'Main'>('ButtonTest');

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

  const navigateToMain = () => {
    setCurrentScreen('Main');
  };
  
  var parent = new TaskModel("122", "dp", "122", [], [], "More Test", "yellow", [], [], "2024-03-11T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
  var childOfParent = new TaskModel("111", "dp", "122", [], [], "More Test on Parent of Children", "yellow", [parent], [], "2024-03-11T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
  childOfParent.children.push(new TaskModel("101", "dp", "122", [], [], "More Test child 1", "yellow", [childOfParent, parent], [], "2024-03-11T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
  childOfParent.children.push(new TaskModel("102", "dp", "122", [], [], "More Test child 2", "yellow", [childOfParent, parent], [], "2024-03-04T19:54:02+0000", "2024-03-05T20:54:02+0000", false, {}, "", [], true, "", []))
  childOfParent.children.push(new TaskModel("103", "dp", "122", [], [], "More Test child 3", "yellow", [childOfParent, parent], [], "2024-03-07T19:54:02+0000", "2024-03-11T20:54:02+0000", false, {}, "", [], true, "", []))
  childOfParent.children.push(new TaskModel("104", "dp", "122", [], [], "More Test on child 4", "yellow", [childOfParent, parent], [], "2024-03-19T19:54:02+0000", "2024-03-20T20:54:02+0000", false, {}, "", [], true, "", []))
  parent.children.push(childOfParent)

  var parent1 = new TaskModel("121", "dp", "121", [], [], "Test Root Task", "red", [], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
  var childOfParent1 = new TaskModel("112", "dp", "121", [], [], "Test Root Task", "red", [parent1], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", [])
  childOfParent1.children.push(new TaskModel("002", "dp", "121", [], [], "Test Root Task", "red", [childOfParent1, parent1], [], "2024-03-08T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
  childOfParent1.children.push(new TaskModel("001", "dp", "121", [], [], "Test Root Task", "red", [childOfParent1, parent1], [], "2024-02-29T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
  childOfParent1.children.push(new TaskModel("003", "dp", "121", [], [], "Test Root Task", "red", [childOfParent1, parent1], [], "2024-03-14T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
  childOfParent1.children.push(new TaskModel("004", "dp", "121", [], [], "Test Root Task", "red", [childOfParent1, parent1], [], "2024-03-14T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []))
  parent1.children.push(childOfParent1)

  const userId = 'Afkdg24O0SQrzBX8V0MLlxaRuRh1'; // Placeholder, replace with actual logic to get the user ID
  const taskId = 'H9tiWY5n26BLjhE07rHE'; // Placeholder, replace with actual logic to get the task ID

  
  return (
        <View style={styles.container}>
          {currentScreen === 'Landing' && <LandingScreen navigateToSignUp={navigateToSignUp} navigateToLogin={navigateToLogin} navigateToMain={navigateToMain}/>}
          {currentScreen === 'Main' && <Main rootTasks={[]}/>}
          {currentScreen === 'ButtonTest' && <ButtonTest userId={userId} taskId={taskId} />}
          <View style={styles.signupLoginContainer}>
          <>
            {currentScreen === 'Login' && <LoginScreen navigateToSignUp={navigateToSignUp} navigateToLogin={navigateToLogin} navigateToMain={navigateToMain}/>}
            {currentScreen === 'SignUp' && <SignUpScreen navigateToSignUp={navigateToSignUp} navigateToLogin={navigateToLogin} navigateToMain={navigateToMain} />}
          </> 
            <StatusBar style="auto" />
          </View>
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
  signupLoginContainer:{
    alignItems: 'center',
    justifyContent: 'center',

  },

});
