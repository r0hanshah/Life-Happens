import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthLoadingScreenProps {
  navigateToMain: () => void;
  navigateToLogin: () => void;
}

const AuthLoadingScreen: React.FC<AuthLoadingScreenProps> = ({ navigateToMain, navigateToLogin }) => {
  useEffect(() => {
    console.log('AuthLoadingScreen mounted');
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Token in AuthLoadingScreen:', token);
        if (token) {
          const response = await fetch('http://127.0.0.1:5000/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Ensure the token is correctly included
            },
            body: JSON.stringify({ token }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log('Token verified:', data);
            navigateToMain();
          } else {
            const errorData = await response.json();
            console.log('Token verification failed:', errorData);
            navigateToLogin();
          }
        } else {
          console.log('No token found');
          navigateToLogin();
        }
      } catch (error) {
        console.error('Error checking token in AuthLoadingScreen:', error);
        navigateToLogin();
      }
    };

    checkToken();
  }, [navigateToMain, navigateToLogin]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Loading...</Text>
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