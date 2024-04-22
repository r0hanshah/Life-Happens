import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import NavBar from "./NavBar";
interface LandingProps {
    navigateToSignUp: () => void;
    navigateToLogin: () => void;
    navigateToMain: () => void;
}

const LandingScreen: React.FC<LandingProps> = ({ navigateToSignUp, navigateToLogin, navigateToMain }) => {


    return (
        <View style={styles.container}>
            <NavBar navigateToMain={navigateToMain} navigateToSignUp={navigateToSignUp} navigateToLogin={navigateToLogin} />
            <View style={styles.contentContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.title}>Life Happens.</Text>
                    <Text style={styles.h2}>Start getting your life organized today</Text>
                </View>
                <View style={styles.middleContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.h1}>Our Goal:</Text>
                        <Text style={styles.h2}>We aim to make life less complicated by providing a simple way to break up and
                            manage any task. Then placing the subtasks into an intuitive calendar for ease of use.
                        </Text>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.h1}>Who We Are:</Text>
                        <Text style={styles.h2}>The team is made up of four students at the University of Florida. Daniel
                            Parra has made the entire calendar page and connected it with the generative AI to produce the
                            subtasks. David Vera set up and created the functions for the database and API that stores all user content.
                            Rohan Shah is the one that set up the development infrastructure and contributed to connecting
                            the database and frontend together. Lastly, Joseph Malegni implemented the rest of the frontend
                            after the calendar page.
                        </Text>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.h1}>How to Use Life Happens:</Text>
                        <Text style={styles.h2}>Lorem Ipsum Dolor.
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.button, styles.toLoginLink]} onPress={navigateToSignUp}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151515',
        alignItems: 'center',
        width: '100%',
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#383838',
        padding: 20,
        borderRadius: 8,
        width: '25%',
        marginHorizontal: 20,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#FFFFFF'
    },
    h1: {
        fontSize: 24,
        fontWeight: 'normal',
        marginTop: 8,
        color: '#FFFFFF',
    },
    h2: {
        fontSize: 18,
        fontWeight: 'normal',
        marginTop: 8,
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        justifyContent: 'center',
        width: 250
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: 8,
    },
    topContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleContainer: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginHorizontal: 40, // Added margin to push content to the left
        padding: 20,

    },
    toLoginLink: {
        marginTop: 16,
        color: '#007AFF',
    },

    profileContainer: {
        paddingTop: 12,
        height: '100%',
        width: '25%',
        backgroundColor:'#383838',
        marginLeft: 'auto',
    },

    profileTitle: {
        fontSize: 32,
        textAlign: "center",
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 18,
        color: 'white',
    },

    profileItem:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        marginVertical: 25,
        marginHorizontal: 5,
    },
    profileText:{
        color: '#fff',
        fontSize: 16,
    },
    profileClose:{
        backgroundColor: '#007AFF',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        padding: 5,
        marginVertical: 30,
        marginHorizontal: 120,
    },
});

export default LandingScreen;
