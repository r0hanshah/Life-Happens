import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface NavProps {
    navigateToSignUp: () => void;
    navigateToLogin: () => void;
    navigateToMain: () => void;
}
const NavBar: React.FC<NavProps> = ({ navigateToMain, navigateToSignUp, navigateToLogin }) => {
    return (
        <View style={styles.navBar}>
            <TouchableOpacity style={styles.navButton} onPress={navigateToMain}>
                <Text style={styles.navButtonText}>Main</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={navigateToSignUp}>
                <Text style={styles.navButtonText}>SignUp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={navigateToLogin}>
                <Text style={styles.navButtonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 8,

    },
    navButton: {
        paddingHorizontal: 20,
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default NavBar;
