import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions, Text, Image, TouchableOpacity, TextInput, Alert, Button, ScrollView, FlatList, Platform, Linking, ActivityIndicator } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

import UserModel from '../../models/UserModel';
import MainController from '../../controllers/main/MainController';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

import TimeBlocker from './TimeBlocker';

interface ProfileViewProps {
  user: UserModel;
  onPress: () => void;
  signOut: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({user, onPress, signOut}) => {

    let [fontsLoaded] = useFonts({
        Inter_900Black
        });

  return(
    <View style={{overflow:'hidden', minHeight:'100%'}}>
        <View style={styles.gradientOverlayL}>
            <LinearGradient
            colors={["orange", "orange"]}              
            style={styles.gradient}/>
        </View>
        <View style={[styles.container,styles.containerL]}>
            <View style ={{flexDirection:'row', width:'100%', paddingBottom: 20}}>
                <ScrollView style={{ height: useWindowDimensions().height, padding:39}}>
                    <View style={{flexDirection:'row', width:'100%', alignItems:'flex-start'}}>
                        <View style={{justifyContent:'center', alignItems:'center', height: 80, width: 80, backgroundColor:'orange', borderRadius:50, marginRight:10, marginBottom:30}}
                        >
                            <Text style={{color:'white', fontSize:40}}>{user.name.at(0)}</Text>
                        </View>
                    <View>
                        <Text style={{color:"white", fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:40, marginBottom:5}}>{user.name}</Text>
                        <Text style={{color:'gray', fontSize:20}}>{user.email}</Text>
                    </View>
                    </View>
                    <View style={{padding: 30}}>
                        <Text style={{color:"white", fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:30, marginBottom:30}}>Rest Periods</Text>
                        <TimeBlocker user={user}/>
                        <Text style={{color:"white", fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:30, marginVertical:30}}>All Root Tasks</Text>

                        
                        <Text style={{color:"red", fontFamily:fontsLoaded?'Inter_900Black' : 'Arial', fontSize:30, marginTop:30}}>Red Zone</Text>

                        <TouchableOpacity onPress={signOut}>
                        <Text style={{color:"red", fontSize:15, marginVertical:10}}>Sign Out</Text>
                        </TouchableOpacity>
                        

                        <Text style={{color:"red", fontSize:15, marginVertical:10}}>Delete Account</Text>
                        
                        
                    </View>
                    
                    

                </ScrollView>
                <View style={[{width: '5%', minHeight:'100%', alignItems:'center', position:'absolute', top:20, right:20}]}>
                        <TouchableOpacity onPress={onPress}>
                            <Image source={require('../../assets/x_mark_white.png')} style={{width:20, height:20}}></Image>
                        </TouchableOpacity>
                </View>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

  function darkenColor(color:String, factor:Double) {
    // Convert hex color to RGB
    let hex = color.replace(/^#/, '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
  
    // Darken each RGB component
    r = Math.round(r * (1 - factor));
    g = Math.round(g * (1 - factor));
    b = Math.round(b * (1 - factor));
  
    // Ensure values are within range
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
  
    // Convert RGB back to hex
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
  }

export default ProfileView;