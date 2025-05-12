import React, { useState } from 'react';
import Image from 'next/image';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';

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

    let [fontsLoaded] = useFonts({
        Inter_900Black
        });
    
    const [toggleUpcomingRoots, setToggleUpcomingRoots] = useState(true)
    const [togglePastRoots, setTogglePastRoots] = useState(false)
    const [viewSettings, setViewSettings] = useState(false);

    let windowWidth = useWindowDimensions().width;
    let windowHeight = useWindowDimensions().height;
    
    const displayAllTaskList = () => {
        // TODO: Takes in what level of task that the user wants to display
        // SPECIAL CASE: -1 for if the user only wants to display leaf tasks

        // Organize by month and root task
    }
    

    return(
        <View style={{overflow: viewSettings ? 'visible' : 'hidden', minHeight:'100%'}}>
            <View style={styles.gradientOverlayL}>
                <LinearGradient
                colors={["orange", "orange"]}              
                style={styles.gradient}/>
            </View>

            <View style={[styles.container,styles.containerL]}>
                <View style ={{flexDirection:'row', width:'100%', paddingBottom: 20}}>
                    <ScrollView style={{ height: useWindowDimensions().height, padding:39}}>
                        <View style={{flexDirection:'row', width:'100%', alignItems:'flex-start'}}>
                            <View style={{justifyContent:'center', alignItems:'center', height: 80, width: 80, backgroundColor:'orange', borderRadius:50, marginRight:20, marginBottom:30}}
                            >
                                <TouchableOpacity style={{backgroundColor:'#717171', borderColor:'#151515', borderRadius:30, borderWidth:4,position:'absolute', width:40, height:40, padding:10, right:-10, bottom:-10, justifyContent:'center', alignItems:'center'}}
                                onPress={editAccount}
                                >
                                    <Image source={require('../../assets/pencil.png')} style={{height:20, width:20}}/>
                                </TouchableOpacity>
                                <Text style={{color:'white', fontSize:40}}>{user.name.at(0)}</Text>
                            </View>
                            <View>
                                <Text style={{color:"white", fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:40, marginBottom:5}}>{user.name}</Text>
                                <Text style={{color:'gray', fontSize:20}}>{user.email}</Text>
                            </View>
                            <TouchableOpacity style={{marginLeft:'auto', alignItems:'flex-end', alignSelf:'flex-end'}} onPress={()=>{setViewSettings(!viewSettings)}}>
                                <Image source={require('../../assets/gear-icon.png')} style={{height:40, width:40, margin:20}}/>
                            </TouchableOpacity>
                        </View>
                        <View style={{padding: 25}}>
                            <Text style={{color:"white", fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:30, marginBottom:30}}>Rest Periods</Text>
                            <TimeBlocker user={user}/>

                            <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={()=>{setToggleUpcomingRoots(!toggleUpcomingRoots)}}>
                                <Image source={require('../../assets/triangle_right.png')} style={{
                                        width:20, height:20, marginRight:10, transform: [{ rotate: toggleUpcomingRoots ? '90deg' : '0deg' }]
                                    }}/>
                                <Text style={{color:"white", fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:30, marginVertical:30}}>Upcoming Root Tasks</Text>
                            </TouchableOpacity>

                            {/* Get all root tasks */}

                            <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={()=>{setTogglePastRoots(!togglePastRoots)}}>
                                <Image source={require('../../assets/triangle_right.png')} style={{
                                        width:20, height:20, opacity:0.2, marginRight:10, transform: [{ rotate: togglePastRoots ? '90deg' : '0deg' }]
                                    }}/>
                                <Text style={{color:"white", opacity:0.2, fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:30, marginVertical:30}}>Past Root Tasks</Text>
                            </TouchableOpacity>
                            
                            <Text style={{color:"red", fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:30, marginTop:30}}>Red Zone</Text>

                            <TouchableOpacity onPress={signOut}>
                            <Text style={{color:"red", fontSize:15, marginVertical:10}}>Sign Out</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={deletAccount}>
                            <Text style={{color:"red", fontSize:15, marginVertical:10}}>Delete Account</Text>
                            </TouchableOpacity>
                            
                        </View>
                        
                        

                    </ScrollView>
                    <View style={[{width: '5%', minHeight:'100%', alignItems:'center', position:'absolute', top:20, right: 20 - (viewSettings ? windowWidth*0.51 : 0)}]}>
                            <TouchableOpacity onPress={onPress}>
                                <Image source={require('../../assets/x_mark_white.png')} style={{width:20, height:20}}></Image>
                            </TouchableOpacity>
                    </View>
                </View>
            </View>

            {viewSettings &&
            <View  style={{height: windowHeight, position:'absolute', top:0, width:windowWidth*0.515, backgroundColor:'#050505', left:windowWidth*0.485}}>
                <View style={[styles.container, {flexDirection:'column', overflow:'hidden', padding:10, paddingHorizontal:80}]}>
                    <Text style={styles.h1}>Settings</Text>
                    <EmailSettings user={user}/>
                </View>
                <View style={styles.gradientOverlayL}>
                    <LinearGradient
                    colors={["orange", "orange"]}              
                    style={styles.gradient}/>
                </View>
            </View>
            }
        </View>
    );
};

export default ProfileView;