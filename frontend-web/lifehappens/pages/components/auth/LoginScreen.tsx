import React, {useState} from 'react';
import styles from '@/styles/components/auth/LoginScreen.module.css'
import TouchableOpacity from '@/pages/native/TouchableOpacity'

import AuthController from '@/controllers/auth/AuthController';

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
          <img
            src="/chev_white.png"
            style={{ width: 20, height: 20, transform: 'rotate(90deg)' }}
            alt="Chevron"
          />
        </TouchableOpacity>
        <div className={styles.contentContainer}>

        <p className={styles.largeTitle}>Life Happens.</p>

        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        <TouchableOpacity style={styles.button} onClick={()=>{
          setBadLogin(false)
          controller.handleLogin(email, password, navigateToMain, ()=>{setBadLogin(true)})
          }}>
          <p className={styles.buttonp}>Log in</p>
        </TouchableOpacity>
        {badLogin &&
        <p style={{color:'red'}}>Log in was unsuccessful...</p>
        }
        {/*<TouchableOpacity className={[styles.button, styles.googleButton]} onClick={signInWithGoogle}>*/}
        {/*  <Ionicons name="logo-google" size={24} color="white" />*/}
        {/*  <p className={styles.buttonp}>Log in with Google</p>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity className={[styles.button, styles.appleButton]} onClick={signInWithApple}>*/}
        {/*  <Ionicons name="logo-apple" size={24} color="white" />*/}
        {/*  <p className={styles.buttonp}>Log in with Apple</p>*/}
        {/*</TouchableOpacity>*/}
        {/*<TouchableOpacity className={[styles.button, styles.githubButton]} onClick={signInWithGitHub}>*/}
        {/*  <Ionicons name="logo-github" size={24} color="white" />*/}
        {/*  <p className={styles.buttonp}>Log in with GitHub</p>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity onClick={navigateToSignUp}>
          <p className={styles.signUpLink}>Don't have an account? Sign up here</p>
        </TouchableOpacity>
      </div>
      </div>
  );
};

export default LoginScreen;