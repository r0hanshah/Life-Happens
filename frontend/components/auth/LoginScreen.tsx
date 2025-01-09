import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import NavBar from "../landing/NavBar";

import AuthController from '../../controllers/auth/authController';

interface LoginScreenProps {
  navigateToSignUp: () => void;
  navigateToLogin: () => void;
  navigateToMain: () => void;
  navigateToLanding: () => void;

}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigateToSignUp, navigateToLogin, navigateToMain, navigateToLanding}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badLogin, setBadLogin] = useState(false);
  const controller = new AuthController()

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
        <View style={styles.contentContainer}>

        <Text style={styles.largeTitle}>Life Happens.</Text>

        <TextInput style={styles.input}
                   placeholder="Email"
                   onChangeText={(text) => setEmail(text)}
                   value={email} />


        <TextInput style={styles.input}
                   placeholder="Password"
                   secureTextEntry={true}
                   onChangeText={(text) => setPassword(text)}
                   value={password} />


        <TouchableOpacity style={styles.button} onPress={()=>{
          setBadLogin(false)
          controller.handleLogin(email, password, navigateToMain, ()=>{setBadLogin(true)})
          }}>
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        {badLogin &&
        <Text style={{color:'red'}}>Log in was unsuccessful...</Text>
        }
        {/*<TouchableOpacity style={[styles.button, styles.googleButton]} onPress={signInWithGoogle}>*/}
        {/*  <Ionicons name="logo-google" size={24} color="white" />*/}
        {/*  <Text style={styles.buttonText}>Log in with Google</Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity style={[styles.button, styles.appleButton]} onPress={signInWithApple}>*/}
        {/*  <Ionicons name="logo-apple" size={24} color="white" />*/}
        {/*  <Text style={styles.buttonText}>Log in with Apple</Text>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity style={[styles.button, styles.githubButton]} onPress={signInWithGitHub}>*/}
        {/*  <Ionicons name="logo-github" size={24} color="white" />*/}
        {/*  <Text style={styles.buttonText}>Log in with GitHub</Text>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity>
          <Text onPress={navigateToSignUp} style={styles.signUpLink}>Don't have an account? Sign up here</Text>
        </TouchableOpacity>
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#151515',
    alignItems: 'center',
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  largeTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 24,
    color: '#FFFFFF'

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 12,
  },
  signUpLink: {
    marginTop: 16,
    color: '#007AFF',
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
    marginVertical: 16,
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
});

export default LoginScreen;