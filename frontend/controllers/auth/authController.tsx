import PropertyListener from "../Listener";
import UserModel from "../../models/UserModel";
import MainController from "../main/MainController";
import { Alert } from "react-native";
import { getUser, getTask } from "../../services/taskServices";
import TaskModel from "../../models/TaskModel";
// This will control anything that happens inside Main view

class AuthController {
    // Private constructor to prevent instantiation from outside
    constructor() {
      // Initialization code here
    }

    async handleLogin(email:string, password:string, completion:()=>void) {
        try {
          const response = await fetch('http://127.0.0.1:5000/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              "email": email,
              "password":password
            })
          });
    
          if (!response.ok) {
            throw new Error('Login failed');
          }
    
          Alert.alert('Success', 'Login successful');
          const data = await response.json();
          const user_id = data['user_id']
          const userData = await this.handleGetUser(user_id, email)
          const user = userData[0]
          const rootTaskIds = userData[1]

          const userTasks = await this.handleGetUserTasks(user_id, rootTaskIds)

          const mainController = MainController.getInstance()

          console.log(userTasks)

          mainController.setUser(user)
          mainController.setTasks(userTasks)
          // Redirect user or do something else on success
          completion();
        } catch (error) {
          Alert.alert('Error', 'Login failed');
          console.error('Login error:', error);
        }
      };

    private handleGetUser = async (userId:string, email:string):Promise<[UserModel | null, string[]]> => {
        try {
            const data = await getUser(userId);
            const name = data['Name']
            const picture = data['ProfilePicture']
            const rootTaskIds = data['TaskTreeRoots']
            console.log(typeof rootTaskIds)
            return [new UserModel(userId, name, picture, email), rootTaskIds]
        } catch (e) {
            console.error('Error fetching user:', e);
            return [null, []]
        }
    };

    private handleGetUserTasks = async (userId:string, taskIds:object):Promise<TaskModel[]> => {
        var tasks:TaskModel[] = []
        Object.keys(taskIds).forEach(async id => {
            try
            {
                const task = await getTask(userId, id)
                tasks.push(task)
            }
            catch (e) {
                console.error('Error fetching user:', e);
            }
        })
        return tasks
    }
  }

export default AuthController