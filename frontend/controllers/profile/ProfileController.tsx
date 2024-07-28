import PropertyListener from "../Listener";
import UserModel from "../../models/UserModel";
import MainController from "../main/MainController";
import { Alert } from "react-native";
import { getUser, getTask } from "../../services/taskServices";
import TaskModel from "../../models/TaskModel";
// This will control anything that happens inside Main view

class ProfileController {
    // Private constructor to prevent instantiation from outside
    constructor() {
      // Initialization code here
    }

    async handleSaveRestPeriod(restPeriods:string[], user_id:string) {
        try 
        {
            const response = await fetch('http://127.0.0.1:5000/user/'+user_id+'/save_rest_periods', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "rest_periods": restPeriods
                })
              });
        
              if (!response.ok) {
                throw new Error('Save of rest periods failed');
              }
        }
        catch (error) 
        {
            Alert.alert('Error', 'Save of rest periods failed');
            console.error('Save error:', error);
        }
    }
}

export default ProfileController