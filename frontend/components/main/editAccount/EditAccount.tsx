import React from 'react';
import { View, ViewStyle, useWindowDimensions, Text, TouchableHighlight, Button, TouchableOpacity } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';
import { deleteUser } from '../../../services/taskServices';
import MainController from '../../../controllers/main/MainController';
import UserModel from '../../../models/UserModel';

interface EditAccountProps {
  cancel: () => void
  user: UserModel
  saveChanges: () => void
}

const EditAccount: React.FC<EditAccountProps> = ({cancel, saveChanges, user}) => {

  const controller = MainController.getInstance();

  let [fontsLoaded] = useFonts({
    Inter_900Black
  });

  return( 
    <View style={{width:500, padding:30, justifyContent:'space-around', backgroundColor:'#151515', borderRadius:20}}>
        <Text style={{fontFamily:'Inter_900Black', color:'white', textAlign:'center', fontSize:30}}>Editing Account</Text>

        
        
        <View style={{flexDirection:'row', justifyContent:'space-around', margin:10}}>
            <TouchableOpacity onPress={cancel} style={{
                padding:10,
                paddingHorizontal:20,
                backgroundColor:'#303030',
                borderRadius:20
            }}>
                <Text style={{color:'gray'}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                // handle saving changes to user's profile
                saveChanges()
            }} style={{
                padding:10,
                paddingHorizontal:20,
                backgroundColor:'#303030',
                borderRadius:20
            }}>
                <Text style={{color:'red'}}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default EditAccount;