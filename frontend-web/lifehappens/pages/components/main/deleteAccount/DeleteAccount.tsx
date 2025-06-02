import React from 'react';
import TouchableOpacity from '@/pages/native/TouchableOpacity';
import { Inter } from 'next/font/google'

import { deleteUser } from '@/services/taskServices';
import MainController from '@/controllers/main/MainController';
import UserModel from '@/models/UserModel';

interface DeleteAccountProps {
  cancel: () => void
  user: UserModel
  deleteAccount: () => void
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({cancel, deleteAccount, user}) => {

  const controller = MainController.getInstance();

  const Inter_900 = Inter({
    weight: "900"
  })

  return( 
    <div style={{width:500, padding:30, justifyContent:'space-around', backgroundColor:'#151515', borderRadius:20}}>
        <p className={Inter_900.className} style={{ color:'white', textAlign:'center', fontSize:30}}>Are you sure you want to delete your account?</p>
        <p style={{color:'#aaaaaa', margin:10, textAlign:'center'}}>Deleting your account is permanent and can not be undone. All your private documents and tasks will be deleted and will not be recoverable.</p>
        <div style={{flexDirection:'row', justifyContent:'space-around', margin:10}}>
            <TouchableOpacity onClick={cancel} style={{
                padding:10,
                paddingInline:20,
                backgroundColor:'#303030',
                borderRadius:20
            }}>
                <p style={{color:'gray'}}>Cancel</p>
            </TouchableOpacity>
            <TouchableOpacity onClick={()=>{
                handleDeleteUser(user.id)
                localStorage.removeItem('authToken')
                deleteAccount()
            }} style={{
                padding:10,
                paddingInline:20,
                backgroundColor:'#303030',
                borderRadius:20
            }}>
                <p style={{color:'red'}}>Delete</p>
            </TouchableOpacity>
        </div>
    </div>
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