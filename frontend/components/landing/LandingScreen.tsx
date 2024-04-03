import React, {useState} from "react";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Modal  } from "react-native";


const UserProfilePopup = ({ onClose }: { onClose: () => void }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={true}>
            < View style={styles.profileContainer}>
                <Text style = {styles.profileTitle}>
                    Welcome (User)
                </Text>

                <TouchableOpacity style={styles.profileItem}>
                    <Text style={styles.profileText}>AI Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileItem}>
                    <Text style={styles.profileText}>Notification Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileItem}>
                    <Text style={styles.profileText}> Shared Task Trees</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileClose} onPress={onClose} >
                    <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

interface LandingProps {
    navigateToSignUp: () => void;
    navigateToLogin: () => void;
    navigateToLanding: () => void;
}

const LandingScreen: React.FC<LandingProps> = ({ navigateToSignUp, navigateToLanding, navigateToLogin }) => {
    const [showProfile, setShowProfile] = useState(false);


    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton} onPress={navigateToLanding}>
                    <Text style={styles.navButtonText}>Main</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={navigateToSignUp}>
                    <Text style={styles.navButtonText}>SignUp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={navigateToLogin}>
                    <Text style={styles.navButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => setShowProfile(true)}>
                    <Text style={styles.navButtonText}>Profile</Text>
                </TouchableOpacity>
                {/* Add other navigation buttons here */}
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.topContainer}>
                    <Text style={styles.title}>Life Happens</Text>
                    <Text style={styles.h2}>Increasing Productivity Since 2024.</Text>
                </View>
                <View style={styles.middleContainer}>
                    <Image src = 'frontend/assets/adaptive-icon.png' style={styles.image} />
                </View>
                <TouchableOpacity style={[styles.button, styles.toLoginLink]} onPress={navigateToSignUp}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
            {showProfile && <UserProfilePopup onClose={() => setShowProfile(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#007AFF',
        paddingVertical: 12,
    },
    navButton: {
        paddingHorizontal: 20,
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    h2: {
        fontSize: 18,
        fontWeight: 'normal',
        marginTop: 8,
    },
    image: {
        width: 300,
        height: 260,
        justifyContent: 'center',
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    toLoginLink: {
        marginTop: 16,
        color: '#007AFF',
    },

    profileContainer: {
        paddingTop: 12,
        height: '100%',
        width: '25%',
        backgroundColor:'gray',
        marginLeft: 'auto',
    },

    profileTitle: {
        textAlign: "center",
        fontWeight: 'bold',
        marginTop: 20,
        fontSize: 20,
        marginBottom: 18,
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
        padding: 5,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
        marginHorizontal: 10,
        justifyContent: 'center',
    },
});

export default LandingScreen;
