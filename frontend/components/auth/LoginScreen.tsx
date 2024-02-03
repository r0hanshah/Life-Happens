import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigateToSignUp: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigateToSignUp }) => {
  const signInWithGoogle = () => {
    // Add logic for Google sign-in
  };

  const signInWithApple = () => {
    // Add logic for Apple sign-in
  };

  const signInWithGitHub = () => {
    // Add logic for GitHub sign-in
    console.log("Hello")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.largeTitle}>Life Happens.</Text>
      <TextInput style={styles.input} placeholder="Email" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={signInWithGoogle}>
        <Ionicons name="logo-google" size={24} color="white" />
        <Text style={styles.buttonText}>Log in with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.appleButton]} onPress={signInWithApple}>
        <Ionicons name="logo-apple" size={24} color="white" />
        <Text style={styles.buttonText}>Log in with Apple</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.githubButton]} onPress={signInWithGitHub}>
        <Ionicons name="logo-github" size={24} color="white" />
        <Text style={styles.buttonText}>Log in with GitHub</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text onPress={navigateToSignUp} style={styles.signUpLink}>Don't have an account? Sign up here</Text>
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
  largeTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
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
});

export default LoginScreen;
