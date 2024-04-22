import React, {useState} from "react";
import {Modal, TouchableOpacity, Text, StyleSheet, View} from "react-native";


const UserProfilePopup = ({ onClose }: { onClose: () => void }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={true}>
            <View style={styles.profileContainer}>
                <Text style={styles.profileTitle}>
                    Welcome
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

const styles = StyleSheet.create({
    profileContainer: {
        paddingTop: 12,
        height: '100%',
        width: '25%',
        backgroundColor: '#383838',
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
    profileItem: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        marginVertical: 25,
        marginHorizontal: 5,
    },
    profileText: {
        color: '#fff',
        fontSize: 16,
    },
    profileClose: {
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
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default UserProfilePopup;
