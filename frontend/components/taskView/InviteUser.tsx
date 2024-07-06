import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Button, Alert } from 'react-native';

const InviteUser = ({ taskId, inviterId }) => {
  const [email, setEmail] = useState('');

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

  return (
    <View>
      <TextInput
        placeholder="Invite User by Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="SEND INVITE" onPress={handleSubmit} />
    </View>
  );
};

export default InviteUser;
