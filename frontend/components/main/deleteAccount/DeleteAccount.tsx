import React from 'react';
import { View, ViewStyle, useWindowDimensions, Text, TouchableHighlight, Button, TouchableOpacity } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';
import { deleteUser } from '../../../services/taskServices';
import MainController from '../../../controllers/main/MainController';
import UserModel from '../../../models/UserModel';

interface DeleteAccountProps {
  cancel: () => void
  user: UserModel
  deleteAccount: () => void
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({cancel, deleteAccount, user}) => {

  const controller = MainController.getInstance();

  let [fontsLoaded] = useFonts({
    Inter_900Black
  });

  return( 
    <View style={{width:500, padding:30, justifyContent:'space-around', backgroundColor:'#151515', borderRadius:20}}>
        <Text style={{fontFamily:'Inter_900Black', color:'white', textAlign:'center', fontSize:30}}>Are you sure you want to delete your account?</Text>
        <Text style={{color:'#aaaaaa', margin:10, textAlign:'center'}}>Deleting your account is permanent and can not be undone. All your private documents and tasks will be deleted and will not be recoverable.</Text>
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
                handleDeleteUser(user.id)
                deleteAccount()
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

const handleDeleteUser = async (userId:string) => {
    try {
        await deleteUser(userId);
        console.log(`User ${userId} deleted successfully`);
        // Here you might want to navigate away from the current view or reset the user state
    } catch (e) {
        console.error('Error deleting user:', e);
        // Handle the error, e.g., display an error message to the user
    }
};

export default DeleteAccount;