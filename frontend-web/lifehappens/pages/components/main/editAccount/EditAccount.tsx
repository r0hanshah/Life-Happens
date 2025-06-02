import React, { useState } from 'react';
import TouchableOpacity from '@/pages/native/TouchableOpacity';

import { Inter } from 'next/font/google'
import MainController from '@/controllers/main/MainController';
import UserModel from '@/models/UserModel';
import { updateUser } from '@/services/taskServices';


interface EditAccountProps {
  cancel: () => void
  user: UserModel
  saveChanges: () => void
}

const EditAccount: React.FC<EditAccountProps> = ({cancel, saveChanges, user}) => {
  const controller = MainController.getInstance();
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  const Inter_900 = Inter({
    weight: "900"
  })
  
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handlePhotoSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      console.log('Selected file:', file);
    }
  };

  return( 
    <div style={{width:700, padding:30, justifyContent:'center', alignItems:'center',backgroundColor:'#151515', borderRadius:20}}>
        <p style={{fontFamily:'Inter_900Black', color:'white', textAlign:'center', fontSize:30}}>Editing Account</p>

        <div style={{flexDirection:'row'}}>
          {profilePicture ? (
            <TouchableOpacity style={{ borderRadius:20, height:300, width:300, marginBlock:30}}>
              <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                <img
                  src={URL.createObjectURL(profilePicture)}
                  style={{ borderRadius: 20, height: 300, width: 300 }}
                  alt="Profile preview"
                />
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="image/png"
                onChange={handlePhotoSelection}
                style={{ display: 'none' }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={{justifyContent:'center', alignItems:'center', backgroundColor:'#303030', borderRadius:20, height:300, width:300, marginBlock:30}}>
              <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                <p style={{color:'#717171', fontFamily:'Inter_900Black', fontSize:20, textAlign:'center'}}>Upload profile photo (.png)</p>
              </label>
              <input
                id="fileUpload"
                type="file"
                accept="image/png"
                onChange={handlePhotoSelection}
                style={{ display: 'none' }}
              />
          </TouchableOpacity>
          )}

          <div style={{marginLeft:20, marginTop:30}}>
            <p style={{fontFamily:'Inter_900Black', color:'white', textAlign:'left', fontSize:25, width:300}}>Name</p>

            <input
              style={{color:'#717171', fontFamily: 'Arial', fontSize:20, textAlign:'left', textAlignLast:'end', minWidth:'70%', height:40, width:300, alignContent:'center', marginBottom:20}}
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder='Full Name...'
            />

            <p style={{fontFamily:'Inter_900Black', color:'white', textAlign: 'left', fontSize:25, width:300}}>Email</p>

            <input
              style={{color:'#717171', fontFamily: 'Arial', fontSize:20, textAlign:'left', textAlignLast:'end', minWidth:'70%', height:40, width:300, alignContent:'center', marginBottom:20}}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder='user@example.com'
            />

            <div style={{width:300, flexDirection:'row', justifyContent:'space-around', margin:10}}>
                <TouchableOpacity onClick={cancel} style={{
                    padding:10,
                    paddingInline:20,
                    backgroundColor:'#303030',
                    borderRadius:20
                }}>
                    <p style={{color:'gray'}}>Cancel</p>
                </TouchableOpacity>
                <TouchableOpacity onClick={()=>{
                    // handle saving changes to user's profile
                    // saveChanges()
                    user.name = name
                    user.email = email
                    updateUser(user.id, {
                      AllowAIMoveTasks: false,
                      ID: user.id,
                      Name: user.name,
                      ParentsOfLeafNodesByTask: {},
                      ProfilePicture: "",
                      Settings: {},
                      SharedTaskTrees: [],
                      TaskTreeNodes: [],
                      WeeklyAITimesAllowed: 3})
                    cancel()
                }} style={{
                    padding:10,
                    paddingInline:20,
                    backgroundColor:'#303030',
                    borderRadius:20
                }}>
                    <p style={{color:'white'}}>Save</p>
                </TouchableOpacity>
            </div>
          </div>

        </div>
        
        

        
    </div>
  );
};

export default EditAccount;