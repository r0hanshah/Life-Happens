import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavBar from "../landing/NavBar";

import UserProfilePopup from "../landing/UserProfilePopup";
import MainController from '../../controllers/main/MainController';
import UserModel from '../../models/UserModel';

interface SignUpScreenProps {
  navigateToSignUp: () => void;
  navigateToLogin: () => void;
  navigateToMain: () => void;
  navigateToLanding: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigateToSignUp, navigateToLogin, navigateToMain, navigateToLanding }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // const signUpWithGoogle = () => {
  //   // Add logic for Google sign-up
  // };
  //
  // const signUpWithApple = () => {
  //   // Add logic for Apple sign-up
  // };
  //
  // const signUpWithGitHub = () => {
  //   // Add logic for GitHub sign-up
  // };

  const handleSignUp = async () => {
    try{
      //add user to authentication
      const response = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "password":password,
          "name": fullName,
          "username": username
        })
      });

      if (!(response.ok)) {
        throw new Error('Sign up failed');
      }

      Alert.alert('Success', 'Sign up successful');
      // Redirect user or do something else on success
       await response.json().then(data=>{
          MainController.getInstance().setUser(new UserModel(data['ID'], data['Name'], data['ProfilePicture'], email))
          navigateToMain();
       })
      
    } catch (error) {
      Alert.alert('Error', 'Sign up failed');
      console.error('Sign up error:', error);
    }
  };

  return (
      <View style={styles.container}>
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 50,
          width: 50,
          backgroundColor: '#007AFF',
          borderRadius: 50,
        }}
                          onPress={navigateToLanding}
        >
          <Image source={require('../../assets/chev_white.png')} style={{width:20, height:20, transform:[{rotate: '90deg'}]}}></Image>
        </TouchableOpacity>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
            style={styles.input}
            placeholder="Full Name"
            onChangeText={(text) => setFullName(text)}
            value={fullName}
        />
        <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
        />
        <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
            value={password}
        />
        <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        {/*<TouchableOpacity style={[styles.button, styles.googleButton]} onPress={signUpWithGoogle}>*/}
        {/*  <Ionicons name="logo-google" size={24} color="white" />*/}
        {/*  <Text style={styles.buttonText}>Sign up with Google</Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity style={[styles.button, styles.appleButton]} onPress={signUpWithApple}>*/}
        {/*  <Ionicons name="logo-apple" size={24} color="white" />*/}
        {/*  <Text style={styles.buttonText}>Sign up with Apple</Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity style={[styles.button, styles.githubButton]} onPress={signUpWithGitHub}>*/}
        {/*  <Ionicons name="logo-github" size={24} color="white" />*/}
        {/*  <Text style={styles.buttonText}>Sign up with GitHub</Text>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity onPress={navigateToLogin}>
          <Text style={styles.backToLoginLink}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: 'white',
    marginTop: 12,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    color: 'white',

  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'center',
    width: 300
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  googleButton: {
    backgroundColor: '#DB4437', // Google red color
    justifyContent: 'center',
    width: 300
  },
  appleButton: {
    backgroundColor: 'black',
    justifyContent: 'center',
    width: 300
  },
  githubButton: {
    backgroundColor: '#333', // GitHub gray color
    justifyContent: 'center',
    width: 300
  },
  backToLoginLink: {
    marginTop: 16,
    color: '#007AFF',
  },
});

export default SignUpScreen;