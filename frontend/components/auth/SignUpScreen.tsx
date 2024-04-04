import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SignUpScreenProps {
  navigateBack: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigateBack }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const signUpWithGoogle = () => {
    // Add logic for Google sign-up
  };

  const signUpWithApple = () => {
    // Add logic for Apple sign-up
  };

  const signUpWithGitHub = () => {
    // Add logic for GitHub sign-up
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch('https://7897-128-227-7-219.ngrok-free.app/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "password":password
        })
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      Alert.alert('Success', 'Sign up successful');
      // Redirect user or do something else on success
    } catch (error) {
      Alert.alert('Error', 'Sign up failed');
      console.error('Sign up error:', error);
    }
  };

  return (
      <View style={styles.container}>
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
        <TouchableOpacity style={[styles.button, styles.googleButton]} onPress={signUpWithGoogle}>
          <Ionicons name="logo-google" size={24} color="white" />
          <Text style={styles.buttonText}>Sign up with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.appleButton]} onPress={signUpWithApple}>
          <Ionicons name="logo-apple" size={24} color="white" />
          <Text style={styles.buttonText}>Sign up with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.githubButton]} onPress={signUpWithGitHub}>
          <Ionicons name="logo-github" size={24} color="white" />
          <Text style={styles.buttonText}>Sign up with GitHub</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateBack}>
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