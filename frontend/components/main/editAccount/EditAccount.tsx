import React, { useState } from 'react';
import { View, ViewStyle, useWindowDimensions, Text, TouchableHighlight, Button, TouchableOpacity, TextInput, Image } from 'react-native';
import { useFonts, Inter_500Medium, Inter_900Black } from '@expo-google-fonts/inter';
import { deleteUser } from '../../../services/taskServices';
import MainController from '../../../controllers/main/MainController';
import UserModel from '../../../models/UserModel';
import * as DocumentPicker from 'expo-document-picker';


interface EditAccountProps {
  cancel: () => void
  user: UserModel
  saveChanges: () => void
}

const EditAccount: React.FC<EditAccountProps> = ({cancel, saveChanges, user}) => {
  const controller = MainController.getInstance();
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  const [profilePicture, setProfilePicture] = useState<DocumentPicker.DocumentPickerAsset | null>(null)

  let [fontsLoaded] = useFonts({
    Inter_900Black
  });

   // Function to handle file selection
   const handlePhotoSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*.png' });

      if (result && result.assets) {
        const doc = result.assets.at(0)!
        const file = {
            name: doc.name,
            size: doc.size,
            type: doc.mimeType!,
            uri: doc.uri,
        }
        // Add the selected file to the files array
        setProfilePicture(result.assets.at(0)!);
      }
    } catch (error) {
      console.log('Error selecting file:', error);
    }
  };

  return( 
    <View style={{width:700, padding:30, justifyContent:'center', alignItems:'center',backgroundColor:'#151515', borderRadius:20}}>
        <Text style={{fontFamily:'Inter_900Black', color:'white', textAlign:'center', fontSize:30}}>Editing Account</Text>

        <View style={{flexDirection:'row'}}>
          {profilePicture ? (
            <TouchableOpacity style={{ borderRadius:20, height:300, width:300, marginVertical:30}} onPress={handlePhotoSelection}>
                <Image source={{ uri: profilePicture.uri }} style={{borderRadius:20, height:300, width:300}}/>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{justifyContent:'center', alignItems:'center', backgroundColor:'#303030', borderRadius:20, height:300, width:300, marginVertical:30}} onPress={handlePhotoSelection}>

            <Text style={{color:'#717171', fontFamily:'Inter_900Black', fontSize:20, textAlign:'center'}}>Upload profile photo (.png)</Text>

          </TouchableOpacity>
          )}

          <View style={{marginLeft:20, marginTop:30}}>
            <Text style={{fontFamily:'Inter_900Black', color:'white', textAlign:'left', fontSize:25, width:300}}>Name</Text>

            <TextInput
            style={{color:'#717171', fontFamily: 'Arial', fontSize:20, textAlign:'left', textAlignVertical:'bottom', minWidth:'70%', height:40, width:300, alignContent:'center', marginBottom:20}}
            scrollEnabled={false}
            onChangeText={()=>{}}
            value={name}
            multiline={true}
            placeholder='Full Name...'
            />

            <Text style={{fontFamily:'Inter_900Black', color:'white', textAlign: 'left', fontSize:25, width:300}}>Email</Text>

            <TextInput
            style={{color:'#717171', fontFamily: 'Arial', fontSize:20, textAlign:'left', textAlignVertical:'bottom', minWidth:'70%', height:40, width:300, alignContent:'center', marginBottom:20}}
            scrollEnabled={false}
            onChangeText={()=>{}}
            value={email}
            multiline={true}
            placeholder='user@example.com'
            />

            <View style={{width:300, flexDirection:'row', justifyContent:'space-around', margin:10}}>
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
                    <Text style={{color:'white'}}>Save</Text>
                </TouchableOpacity>
            </View>
          </View>

        </View>
        
        

        
    </View>
  );
};

export default EditAccount;