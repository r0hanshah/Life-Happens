import React, { useState } from 'react';
import Image from 'next/image';

import UserModel from '@/models/UserModel';

import TimeBlocker from './TimeBlocker';
import EmailSettings from './settings/EmailSection';

interface ProfileViewProps {
  user: UserModel;
  onPress: () => void;
  signOut: () => void;
  deletAccount: () => void;
  editAccount: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({user, onPress, signOut, deletAccount, editAccount}) => {

    const fontsLoaded = true; // Fonts are loaded by Next.js automatically

    const [toggleUpcomingRoots, setToggleUpcomingRoots] = useState(true)
    const [togglePastRoots, setTogglePastRoots] = useState(false)
    const [viewSettings, setViewSettings] = useState(false);

    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 768;
    
    const displayAllTaskList = () => {
        // TODO: Takes in what level of task that the user wants to display
        // SPECIAL CASE: -1 for if the user only wants to display leaf tasks

        // Organize by month and root task
    }
    

    return(
        <div style={{overflow: viewSettings ? 'visible' : 'hidden', minHeight:'100%'}}>
            {/* Gradient overlay */}
            <div style={{
                background: 'linear-gradient(135deg, orange 0%, orange 100%)',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px'
            }}/>

            <div style={{display: 'flex', flexDirection: 'row', width:'100%', paddingBottom: 20}}>
                <div style={{ height: windowHeight, padding:'39px', overflow: 'auto', flex: 1}}>
                    <div style={{display:'flex', flexDirection:'row', width:'100%', alignItems:'flex-start'}}>
                        <div style={{position: 'relative', justifyContent:'center', display: 'flex', alignItems:'center', height: 80, width: 80, backgroundColor:'orange', borderRadius:'50%', marginRight:20, marginBottom:30}}>
                            <button 
                                onClick={editAccount}
                                style={{backgroundColor:'#717171', borderColor:'#151515', border: '4px solid #151515', borderRadius:'30px', position:'absolute', width:40, height:40, padding:10, right:-10, bottom:-10, display: 'flex', justifyContent:'center', alignItems:'center', cursor: 'pointer'}}
                            >
                                <img src={require('../../assets/pencil.png').default || require('../../assets/pencil.png')} style={{height:20, width:20}}/>
                            </button>
                            <span style={{color:'white', fontSize:40, fontWeight: 'bold'}}>{user.name.at(0)}</span>
                        </div>
                        <div>
                            <h2 style={{color:"white", fontSize:40, marginBottom:5, fontWeight: 900, margin: '0 0 5px 0'}}>{user.name}</h2>
                            <p style={{color:'gray', fontSize:20, margin: 0}}>{user.email}</p>
                        </div>
                        <button 
                            onClick={()=>{setViewSettings(!viewSettings)}}
                            style={{marginLeft:'auto', alignItems:'flex-end', alignSelf:'flex-end', border: 'none', backgroundColor: 'transparent', cursor: 'pointer'}}
                        >
                            <img src={require('../../assets/gear-icon.png').default || require('../../assets/gear-icon.png')} style={{height:40, width:40, margin:20}}/>
                        </button>
                    </div>
                    <div style={{padding: 25}}>
                        <h3 style={{color:"white", fontSize:30, marginBottom:30, fontWeight: 900}}>Rest Periods</h3>
                        <TimeBlocker user={user}/>

                        <button 
                            onClick={()=>{setToggleUpcomingRoots(!toggleUpcomingRoots)}}
                            style={{display: 'flex', flexDirection: 'row', alignItems:'center', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
                        >
                            <img src={require('../../assets/triangle_right.png').default || require('../../assets/triangle_right.png')} style={{
                                    width:20, height:20, marginRight:10, transform: toggleUpcomingRoots ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s'
                                }}/>
                            <h3 style={{color:"white", fontSize:30, margin: '30px 0', fontWeight: 900}}>Upcoming Root Tasks</h3>
                        </button>

                        {/* Get all root tasks */}

                        <button 
                            onClick={()=>{setTogglePastRoots(!togglePastRoots)}}
                            style={{display: 'flex', flexDirection: 'row', alignItems:'center', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0}}
                        >
                            <img src={require('../../assets/triangle_right.png').default || require('../../assets/triangle_right.png')} style={{
                                    width:20, height:20, opacity:0.2, marginRight:10, transform: togglePastRoots ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.3s'
                                }}/>
                            <h3 style={{color:"white", opacity:0.2, fontSize:30, margin: '30px 0', fontWeight: 900}}>Past Root Tasks</h3>
                        </button>
                        
                        <h3 style={{color:"red", fontSize:30, marginTop:30, fontWeight: 900}}>Red Zone</h3>

                        <button 
                            onClick={signOut}
                            style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0, color: 'red', fontSize: 15, margin: '10px 0'}}
                        >
                            <p style={{color:"red", fontSize:15, margin: '10px 0'}}>Sign Out</p>
                        </button>
                        
                        <button 
                            onClick={deletAccount}
                            style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0, color: 'red', fontSize: 15, margin: '10px 0'}}
                        >
                            <p style={{color:"red", fontSize:15, margin: '10px 0'}}>Delete Account</p>
                        </button>
                        
                    </div>
                </div>
                <div style={{width: '5%', minHeight:'100%', display: 'flex', alignItems:'center', justifyContent: 'center', position:'absolute', top:20, right: 20 - (viewSettings ? windowWidth*0.51 : 0)}}>
                    <button 
                        onClick={onPress}
                        style={{border: 'none', backgroundColor: 'transparent', cursor: 'pointer'}}
                    >
                        <img src={require('../../assets/x_mark_white.png').default || require('../../assets/x_mark_white.png')} style={{width:20, height:20}}/>
                    </button>
                </div>
            </div>

            {viewSettings && (
                <div style={{height: windowHeight, position:'absolute', top:0, width: windowWidth*0.515, backgroundColor:'#050505', left: windowWidth*0.485}}>
                    <div style={{flexDirection:'column', overflow:'hidden', padding:10, paddingLeft: 80, paddingRight: 80}}>
                        <h1 style={{color: 'white', fontSize: 32, fontWeight: 900}}>Settings</h1>
                        <EmailSettings user={user}/>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, orange 0%, orange 100%)',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '200px',
                        height: '200px'
                    }}/>
                </div>
            )}
        </div>
    );
};

export default ProfileView;