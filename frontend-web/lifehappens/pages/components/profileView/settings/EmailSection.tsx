import React, { useState } from 'react';

import UserModel from '@/models/UserModel';

import ToggleSwitch from '../ToggleSwitch';

import SettingsController from '@/controllers/profile/SettingsController';

import styles from '@/styles/components/profile/profile.module.css'

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
            <p className={styles.h2}>Email Notifications</p>
            <div style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{marginBlock:10, maxWidth:600}}>
                    <p className={styles.p}>Allow email notifications</p>
                    <p className={styles.p_sub}>Disabling this option currently does not stop scheduled email notifications from being sent. To remove scheduled email notifications, navigate to the task and deselect the bell-icon.</p>
                </div>
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
            </div>
            <div style={{flexDirection:'row', justifyContent:'space-between', marginLeft:50, alignItems:'center'}}>
                <div style={{marginBlock:10}}>
                    <p className={styles.p}>Allow start-time notifications</p>
                    <p className={styles.p_sub}>An email will be sent to you at the start time of a leaf task.</p>
                </div>
                
                <ToggleSwitch
                    state={allowStartEmail}
                    onToggle={(on)=>{
                        setAllowStartEmail(on)
                        settingsController.handleUpdateSettingItem("allow_start_time_email_notif", on, user.id)
                        user.settings['allow_start_time_email_notif'] = on
                    }}
                    disable={!allowEmails}
                />
            </div>
            <div style={{flexDirection:'row', justifyContent:'space-between', marginLeft:50, alignItems:'center'}}>
                <div style={{marginBlock:10}}>
                    <p className={styles.p}>Allow end-time notifications</p>
                    <p className={styles.p_sub}>An email will be sent to you at the end time of a leaf task.</p>
                </div>
                <ToggleSwitch
                    state={allowEndEmail}
                    onToggle={(on)=>{
                        setAllowEndEmail(on)
                        settingsController.handleUpdateSettingItem("allow_end_time_email_notif", on, user.id)
                        user.settings['allow_end_time_email_notif'] = on
                    }}
                    disable={!allowEmails}
                />
            </div>
        </>
    );
};

export default EmailSettings;