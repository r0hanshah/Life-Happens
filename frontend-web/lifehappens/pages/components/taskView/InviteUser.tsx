import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Button, Alert, TouchableOpacity, Image, Text } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';

const InviteUser = ({ taskId, inviterId }) => {
  const [email, setEmail] = useState('');
  const [addClicked, setAddClicked] = useState(false);

  const handleSubmit = async () => {
    console.log('Invite button clicked'); // Debugging statement
    try {
      const response = await axios.post('http://127.0.0.1:5000/invite', { email, taskId, inviterId });
      console.log('Response:', response.data); // Debugging statement
      Alert.alert(response.data.message);
    } catch (error) {
      console.error('Error:', error); // Debugging statement
      Alert.alert('Error sending invitation');
    }
  };

  let [fontsLoaded] = useFonts({
    Inter_900Black
  });

  return (
    <View style={{flexDirection:'row', backgroundColor:'#303030', padding:10, borderRadius:20, minWidth:40, minHeight:40, alignItems:'center'}}>
      {addClicked && 
      <View style={{flexDirection:'row', alignItems:'center', marginRight:10}}>
        <TextInput
          placeholder="Invite User by Email"
          value={email}
          onChangeText={setEmail}
          style={{ borderColor: 'gray', borderWidth: 1, borderRadius:20,  padding: 5, color:'gray', marginRight:10 }}
        />

        <TouchableOpacity style={{backgroundColor:"#717171", padding:8, borderRadius:20}} onPress={handleSubmit}>
          <Text style={{fontFamily: fontsLoaded ?'Inter_900Black' : 'Arial', color:'white', fontSize:12}}>Send Invite</Text>
        </TouchableOpacity>

      </View>
      }
      
      <TouchableOpacity onPress={()=>{setAddClicked(!addClicked)}} style={{padding:10}}>
        <Image source={require('../../assets/x_mark_white.png')} style={{width:10, height:10, transform:[{rotate: addClicked ? '0deg' :'45deg'}], opacity:0.7}}/>
      </TouchableOpacity>
    </View>
  );
};

export default InviteUser;
