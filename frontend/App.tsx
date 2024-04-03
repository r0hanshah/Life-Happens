import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './components/auth/LoginScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import Main from './components/main/Main';
import TaskModel from './models/TaskModel';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Login' | 'SignUp'>('Login');

  const navigateToSignUp = () => {
    setCurrentScreen('SignUp');
  };

  const navigateBack = () => {
    setCurrentScreen('Login');
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

  return (
    <View style={styles.container}>
      {/* <CalendarComponent /> */}
      <Main rootTasks={[
        parent1, 
        parent,
        new TaskModel("123", "dp", "123", [], [], "One More Test", "green", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        new TaskModel("124", "dp", "124", [], [], "2 Test", "blue", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        new TaskModel("125", "dp", "125", [], [], "3 Test", "orange", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        new TaskModel("126", "dp", "126", [], [], "4 Test", "pink", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        new TaskModel("127", "dp", "127", [], [], "5 Test", "purple", [], [], "2024-03-12T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        new TaskModel("128", "dp", "128", [], [], "6 Test", "red", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        new TaskModel("129", "dp", "129", [], [], "7 Test", "yellow", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        new TaskModel("130", "dp", "130", [], [], "8 Test", "white", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        new TaskModel("131", "dp", "131", [], [], "9 Test", "aqua", [], [], "2024-03-22T19:54:02+0000", "2024-03-08T20:54:02+0000", false, {}, "", [], true, "", []),
        ]}/>
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
