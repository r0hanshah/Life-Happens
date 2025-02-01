import { Alert } from "react-native";
// This will control anything that happens inside Main view

class SettingsController {
    // Private constructor to prevent instantiation from outside
    constructor() {
      // Initialization code here
    }

    async handleUpdateSettingItem(item:string, value:any, user_id:string)
    {
        try 
        {
            const response = await fetch('http://127.0.0.1:5000/user/'+user_id+'/update_setting', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "item": item,
                  "value": value
                })
              });
        
              if (!response.ok) {
                throw new Error('Save of settings failed');
              }
        }
        catch (error) 
        {
            Alert.alert('Error', 'Save of settings failed');
            console.error('Save error:', error);
        }
    }
}

export default SettingsController