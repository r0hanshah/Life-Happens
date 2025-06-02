import React, {useState} from 'react';
import TouchableOpacity from '../../native/TouchableOpacity';

import styles from '@/styles/components/auth/SignUpScreen.module.css'
import MainController from '@/controllers/main/MainController';
import UserModel from '@/models/UserModel';

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

      console.log('Success', 'Sign up successful');
      // Redirect user or do something else on success
       await response.json().then(data=>{
          MainController.getInstance().setUser(new UserModel(data['ID'], data['Name'], data['ProfilePicture'], email))
          navigateToMain();
       })
      
    } catch (error) {
      console.log('Error', 'Sign up failed');
      console.error('Sign up error:', error);
    }
  };

  return (
      <div className={styles.container}>
        <TouchableOpacity style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 50,
          width: 50,
          backgroundColor: '#007AFF',
          borderRadius: 50,
        }}
                          onClick={navigateToLanding}
        >
          <img src={require('../../assets/chev_white.png')} style={{width:20, height:20, transform: 'rotate(90deg)'}}></img>
        </TouchableOpacity>
        <p className={styles.title}>Sign Up</p>
        <input
            className={styles.input}
            placeholder="Full Name"
            onChange={(text) => setFullName(text.target.value)}
            value={fullName}
        />
        <input
            className={styles.input}
            placeholder="Email"
            type="email"
            onChange={(text) => setEmail(text.target.value)}
            value={email}
        />
        <input
            className={styles.input}
            placeholder="Username"
            onChange={(text) => setUsername(text.target.value)}
            value={username}
        />
        <input
            className={styles.input}
            placeholder="Password"
            type="password"
            onChange={(text) => setPassword(text.target.value)}
            value={password}
        />
        <input
            className={styles.input}
            placeholder="Confirm Password"
            type="password"
            onChange={(text) => setConfirmPassword(text.target.value)}
            value={confirmPassword}
        />
        <TouchableOpacity style={styles.button} onClick={handleSignUp}>
          <p className={styles.buttonText}>Sign Up</p>
        </TouchableOpacity>
        {/*<TouchableOpacity style={[styles.button, styles.googleButton]} onClick={signUpWithGoogle}>*/}
        {/*  <Ionicons name="logo-google" size={24} color="white" />*/}
        {/*  <p style={styles.buttonText}>Sign up with Google</p>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity style={[styles.button, styles.appleButton]} onClick={signUpWithApple}>*/}
        {/*  <Ionicons name="logo-apple" size={24} color="white" />*/}
        {/*  <p style={styles.buttonText}>Sign up with Apple</p>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity style={[styles.button, styles.githubButton]} onClick={signUpWithGitHub}>*/}
        {/*  <Ionicons name="logo-github" size={24} color="white" />*/}
        {/*  <p style={styles.buttonText}>Sign up with GitHub</p>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity onClick={navigateToLogin}>
          <p className={styles.backToLoginLink}>Already have an account? Login</p>
        </TouchableOpacity>
      </div>
  );
};

export default SignUpScreen;