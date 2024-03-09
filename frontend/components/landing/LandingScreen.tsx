import React, {useState} from "react";
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Modal  } from "react-native";
import { useNavigation } from '@react-navigation/native';


const UserProfilePopup = ({ onClose }: { onClose: () => void }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={true}>
            < View style={{ height: '100%', width: '25%', backgroundColor:'blue', marginLeft: 'auto'}}>
                    <Text>User Profile</Text>
                    {/* Add user profile details or options here */}
                    <Button title="Close" onPress={onClose} />
            </View>
        </Modal>
    );
};
const LandingScreen: React.FC = () => {
    const navigation = useNavigation();
    const [showProfile, setShowProfile] = useState(false);


    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Landing')}>
                    <Text style={styles.navButtonText}>About</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.navButtonText}>SignUp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Login')}>
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
                    <Text style={styles.h2}>Increasing Productivity since 2024.</Text>
                </View>
                <View style={styles.middleContainer}>
                    <Image source= '' style={styles.image} />
                </View>
                <TouchableOpacity style={[styles.button, styles.toLoginLink]} onPress={() => navigation.navigate('SignUp')}>
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
});

export default LandingScreen;
