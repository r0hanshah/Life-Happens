import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text,} from 'react-native';

import UserModel from '../../../models/UserModel';

import ToggleSwitch from '../ToggleSwitch';

import SettingsController from '../../../controllers/profile/SettingsController';

interface EmailSettingsViewProps {
  user: UserModel;
}

const EmailSettings: React.FC<EmailSettingsViewProps> = ({user}) => {
    const [allowEmails, setAllowEmails] = useState(user.settings['allow_start_time_email_notif'] || user.settings['allow_end_time_email_notif'])
    const [allowStartEmail, setAllowStartEmail] = useState(user.settings['allow_start_time_email_notif'])
    const [allowEndEmail, setAllowEndEmail] = useState(user.settings['allow_end_time_email_notif'])
    
    const settingsController = new SettingsController()

    return(
        <>
            <Text style={styles.h2}>Email Notifications</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <View style={{marginVertical:10, maxWidth:600}}>
                    <Text style={[styles.p]}>Allow email notifications</Text>
                    <Text style={[styles.p_sub,]}>Disabling this option currently does not stop scheduled email notifications from being sent. To remove scheduled email notifications, navigate to the task and deselect the bell-icon.</Text>
                </View>
                <ToggleSwitch
                    state={allowEmails}
                    onToggle={(on) => {
                        setAllowEmails(on)
                        setAllowStartEmail(on)
                        setAllowEndEmail(on)
                        settingsController.handleUpdateSettingItem("allow_start_time_email_notif", on, user.id)
                        settingsController.handleUpdateSettingItem("allow_end_time_email_notif", on, user.id)
                        user.settings['allow_start_time_email_notif'] = on
                        user.settings['allow_end_time_email_notif'] = on
                    }}
                    disable={false}
                />
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:50, alignItems:'center'}}>
                <View style={{marginVertical:10}}>
                    <Text style={styles.p}>Allow start-time notifications</Text>
                    <Text style={styles.p_sub}>An email will be sent to you at the start time of a leaf task.</Text>
                </View>
                
                <ToggleSwitch
                    state={allowStartEmail}
                    onToggle={(on)=>{
                        setAllowStartEmail(on)
                        settingsController.handleUpdateSettingItem("allow_start_time_email_notif", on, user.id)
                        user.settings['allow_start_time_email_notif'] = on
                    }}
                    disable={!allowEmails}
                />
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:50, alignItems:'center'}}>
                <View style={{marginVertical:10}}>
                    <Text style={styles.p}>Allow end-time notifications</Text>
                    <Text style={styles.p_sub}>An email will be sent to you at the end time of a leaf task.</Text>
                </View>
                <ToggleSwitch
                    state={allowEndEmail}
                    onToggle={(on)=>{
                        setAllowEndEmail(on)
                        settingsController.handleUpdateSettingItem("allow_end_time_email_notif", on, user.id)
                        user.settings['allow_end_time_email_notif'] = on
                    }}
                    disable={!allowEmails}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    h1: {
        color:"white", 
        fontFamily: 'Inter_900Black', 
        fontSize:40, 
        marginVertical:30
    },
    h2: {
        color:"white", 
        fontFamily: 'Inter_900Black', 
        fontSize:30, 
        marginVertical:20
    },
    p: {
        color:"white", 
        fontFamily: 'Arial', 
        fontSize:15,
        marginBottom:5 
    },
    p_sub: {
        color:"#505050", 
        fontFamily: 'Arial', 
        fontSize:15, 
    },
    gradientOverlayL: {
        ...StyleSheet.absoluteFillObject,
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        overflow: 'hidden',
    },
    gradientOverlayR: {
        ...StyleSheet.absoluteFillObject,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
    },
    container: {
        backgroundColor: "#151515",
        zIndex: 1, 
        minWidth: '95%',
        minHeight: '100%'
    },
    containerL: {
        flexDirection: 'row',
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
        marginRight: 3
    },
    containerR: {
        flexDirection: 'row-reverse',
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        marginLeft: 3
    }
  });

export default EmailSettings;