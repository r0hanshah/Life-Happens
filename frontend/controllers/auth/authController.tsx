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

    async handleFetch(user_id:string, email:string, completion:()=>void)
    {
      const userData = await this.handleGetUser(user_id, email)
          const user = userData[0]
          const rootTaskIds = userData[1]
          const nodes = userData[2]

          const mainController = MainController.getInstance()

          const tasks = await this.handleGetUserTasks(user_id, rootTaskIds)
      
          console.log(tasks.length)
          mainController.setUser(user)
          mainController.setTasks(tasks)

          await this.sleep(500) // sleep for 0.5 seconds
          
          // Redirect user or do something else on success
          completion();
    }

    async handleLogin(email:string, password:string, completion:()=>void, handleBadLogin:()=>void) {
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

          console.log(response)
    
          if (!response.ok) {
            handleBadLogin();
            throw new Error('Login failed');
          }
    
          Alert.alert('Success', 'Login successful');
          const data = await response.json();

          // Handle persistent log in 
          if (data.token) {
            console.log("GOT TOKEN: ", data.token)
            localStorage.setItem('authToken', data.token);
          }
          else
          {
            console.log("DID NOT GET TOKEN")
          }

          const user_id = data['user_id']
          const userData = await this.handleGetUser(user_id, email)
          const user = userData[0]
          const rootTaskIds = userData[1]

          const mainController = MainController.getInstance()

          const userTasks = await this.handleGetUserTasks(user_id, rootTaskIds).then( (tasks) => {
            console.log(tasks.length)
            mainController.setUser(user)
            mainController.setTasks(tasks)
            
            // Redirect user or do something else on success
            completion();
          }
          )

          
        } catch (error) {
          Alert.alert('Error', 'Login failed');
          console.error('Login error:', error);
        }
      };

    private handleGetUser = async (userId:string, email:string):Promise<[UserModel | null, string[], string[]]> => {
        try {
            const data = await getUser(userId);
            const name = data['Name']
            const picture = data['ProfilePicture']
            const rootTaskIds = data['TaskTreeRoots']
            const restPeriods = data['RestPeriods']
            const nodes = data['Nodes']
            // composer rest period matrix

            console.log(typeof rootTaskIds)
            return [restPeriods ? new UserModel(userId, name, picture, email, this.composeRestPeriodMatrix(restPeriods)) : new UserModel(userId, name, picture, email), rootTaskIds, nodes]
        } catch (e) {
            console.error('Error fetching user:', e);
            return [null, [], []]
        }
    };

    private composeRestPeriodMatrix(restPeriods:[string])
    {
      var matrix = Array.from({ length: 24 }, () => Array(7).fill(false));
      for(const period of restPeriods)
      {
        const parts = period.split(',');

        // Extract the numbers from the substrings
        const row = parseInt(parts[0], 10);
        const col = parseInt(parts[1], 10); 

        matrix[row][col] = true
      }

      return matrix
    }

    private handleGetUserTasks = async (userId:string, taskIds:object):Promise<TaskModel[]> => {
      const tasks: TaskModel[] = [];
      const promises: Promise<TaskModel | null>[] = [];
  
      // Map each task ID to a promise returned by getTask
      Object.keys(taskIds).forEach(id => {
          promises.push(getTask(userId, id).catch(e => {
              console.error('Error fetching user:', e);
              return null; // Return null in case of an error
          }));
      });
  
      // Wait for all promises to resolve using Promise.all
      const resolvedTasks = await Promise.all(promises);
  
      // Filter out null values (in case of errors) and push valid tasks to the tasks array
      resolvedTasks.forEach(task => {
          if (task !== null) {
              tasks.push(task);
          }
      });
  
      return tasks;
    }

    private sleep(ms:number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }

export default AuthController