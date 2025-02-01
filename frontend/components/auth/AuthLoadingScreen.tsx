import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthController from '../../controllers/auth/authController';

interface AuthLoadingScreenProps {
  navigateToMain: () => void;
  navigateToLogin: () => void;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ navigateToMain, navigateToLogin }) => {
  const controller = new AuthController()
  
  useEffect(() => {
    console.log('AuthLoadingScreen mounted');
    const token = localStorage.getItem('authToken');
    const checkToken = async () => {
      const response = await fetch('http://127.0.0.1:5000/verify-login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8081',
          'Authorization': token ? token : ""
        },
        credentials: 'include', // Include cookies for session
      })
      .catch(err=>{
        console.log(err)
        navigateToLogin()
      })

      console.log("Response: ", response)
      
      if (response && response.ok)
      {
        const data = await response.json()
        console.log(data)
        if (data.logged_in)
        {
          const user_id = data.user_id
          const email = data.email
          controller.handleFetch(user_id,email,navigateToMain)
        }
        else
        {
          navigateToLogin()
        }
      }
      else
      {
        console.log("Failed to verify token")
        navigateToLogin()
      }
    };

    checkToken();
  }, [navigateToMain, navigateToLogin]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={{color:'white', margin:10}}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AuthLoadingScreen;