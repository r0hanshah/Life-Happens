import React, { useState } from "react";
import TouchableOpacity from "../native";
import NavBar from "./NavBar";

import styles from '@/styles/components/landing/LandingScreen.module.css'

interface LandingProps {
    navigateToSignUp: () => void;
    navigateToLogin: () => void;
    navigateToMain: () => void;
}

const LandingScreen: React.FC<LandingProps> = ({ navigateToSignUp, navigateToLogin, navigateToMain }) => {


    return (
        <div className={styles.container}>
            <NavBar navigateToLanding={navigateToMain} navigateToSignUp={navigateToSignUp} navigateToLogin={navigateToLogin} />
            <div className={styles.contentContainer}>
                <div className={styles.topContainer}>
                    <p className={styles.title}>Life Happens.</p>
                    <p className={styles.h3}>Start getting your life organized today</p>
                </div>
                <div className={styles.middleContainer}>
                    <div className={styles.textContainer}>
                        <p className={styles.h1}>Our Goal:</p>
                        <p className={styles.h2}>We aim to make life less complicated by providing a simple way to break up and
                            manage any task. Then placing the subtasks into an intuitive calendar for ease of use.
                        </p>
                    </div>

                    <div className={styles.textContainer}>
                        <p className={styles.h1}>Who We Are:</p>
                        <p className={styles.h2}>The team is made up of four students at the University of Florida. Daniel
                            Parra has made the entire calendar page and connected it with the generative AI to produce the
                            subtasks. David Vera set up and created the functions for the database and API that stores all user content.
                            Rohan Shah is the one that set up the development infrastructure and contributed to connecting
                            the database and frontend together. Lastly, Joseph Malegni implemented the rest of the frontend
                            after the main page.
                        </p>
                    </div>

                    <div className={styles.textContainer}>
                        <p className={styles.h1}>How to Use Life Happens:</p>
                        <p className={styles.h2}>Click the Get Started button below to create an account, From there you will
                            be taken to your Main page with a calendar. Here is where all your tasks and subtasks reside.
                            To create new task, simply click the + button in the lower right corner of the page. Fill out
                            the start and end dates, any additional notes or media, and finally enter the context prompt
                            for the AI to process. Great! You have now successfully started your journey with Life Happens.
                        </p>
                    </div>
                </div>
                <TouchableOpacity style={styles.button + styles.toLoginLink} onClick={navigateToSignUp}>
                    <p className={styles.buttonText}>Get Started</p>
                </TouchableOpacity>
            </div>
        </div>
    );
}

export default LandingScreen;
