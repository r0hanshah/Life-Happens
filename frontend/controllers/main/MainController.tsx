import PropertyListener from "../Listener";
import TaskModel from "../../models/TaskModel"; 

import uuid from 'react-native-uuid'
import { Alert } from "react-native";
import UserModel from "../../models/UserModel";

import { addTask, updateTask, TaskData } from "../../services/taskServices";

// This will control anything that happens inside Main view

class MainController {
    private static instance: MainController | null = null;
    private selectedTask: PropertyListener<TaskModel | null> = new PropertyListener<TaskModel | null>(null);
    private tasksArray: PropertyListener<TaskModel[]> = new PropertyListener<TaskModel[]>([]);
    private reRender: PropertyListener<boolean> = new PropertyListener<boolean>(false);
    private loading: PropertyListener<boolean> = new PropertyListener<boolean>(false);
    private user:PropertyListener<UserModel | null> = new PropertyListener<UserModel | null>(null);

    // Private constructor to prevent instantiation from outside
    private constructor() {
      // Initialization code here
    }
  
    // Static method to retrieve the single instance
    public static getInstance(): MainController {
      if (!MainController.instance) {
        MainController.instance = new MainController();
      }
      return MainController.instance;
    }
  
    // Other methods and properties can be added as needed
    // User functions
    public getUser(): PropertyListener<UserModel | null> {
      return this.user;
    }

    // Method to increase the counter value
    public setUser(user: UserModel | null): void {
        this.user.setValue(user)
    }

    // Getter for the counter property
    public getSelectedTask(): PropertyListener<TaskModel | null> {
        return this.selectedTask;
    }

    // Method to increase the counter value
    public setSelectedTask(selectedTask: TaskModel | null): void {
        this.selectedTask.setValue(selectedTask)
    }

    // Rerender the main view
    public getLoadingGenerateTasks(): PropertyListener<boolean> {
      return this.loading;
    }

    public setLoadingGenerateTasks(bool: boolean): void {
        this.loading.setValue(bool)
    }

    public async handleGenerateTasks(task: TaskModel):Promise<TaskModel[]> {
      this.setLoadingGenerateTasks(true)
      try {
        const context = task.contextText
        const start = task.startDate.toISOString()
        const end = task.endDate.toISOString()
        const pre_existing_subtasks = task.children.map(task => {
          return {
            title:task.title,
            start:task.startDate.toISOString(),
            end:task.endDate.toISOString()
          }
        })
        const file_paths = ["Users/user-1/task-1/DailyScrum 4_3.xlsx", "Users/user-1/task-1/Sprint 1 Presentation.pdf"]

        const response = await fetch('http://127.0.0.1:5000/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "contextText": context,
            "start":start,
            "end": end,
            "subtasks": pre_existing_subtasks,
            "files": file_paths
          })
        });
  
        if (!response.ok) {
          throw new Error('Generation failed');
        }
  
        Alert.alert('Success', 'Generation successful');
        // Redirect user or do something else on success
        const responseData = await response.json();
        const taskModels:TaskModel[] = []
        for (const taskJSON of responseData)
        {
          taskModels.push(new TaskModel(undefined, "creatorId", task.rootId, [], [], taskJSON["title"], task.color, [task, ...task.ancestors], [], taskJSON["startDateISO"], taskJSON["endDateISO"], true, {}, taskJSON["notes"]))
        }
        console.log(taskModels)
        this.setLoadingGenerateTasks(false)
        return taskModels;
      } 
      catch (error) 
      {
        Alert.alert('Error', 'Generation failed');
        console.error('Generation error:', error);
        this.setLoadingGenerateTasks(false)
        return [];
      }
    };

    public getTasks(): PropertyListener<TaskModel[]> {
        return this.tasksArray;
    }

    // Method to increase the counter value
    public setTasks(tasks: TaskModel[]): void {
        this.tasksArray.setValue(tasks)
    }

    public deleteRootTask(task:TaskModel)
    {
      const filteredTasks = this.tasksArray.getValue().filter(inTask => inTask.id !== task.id)
      this.setTasks(filteredTasks)
      this.setSelectedTask(null)
    }


    private getRandomHexColor():string {
      let color = "#";
      
      // Function to generate a random hex component
      const getRandomHexComponent = () => {
        return Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
      };
    
      // Generate a random color until it's not too dark
      var brightness = 0
      do {
        color = "#" + getRandomHexComponent() + getRandomHexComponent() + getRandomHexComponent();
        // Calculate brightness using YIQ formula (https://en.wikipedia.org/wiki/YIQ)
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        brightness = (r * 299 + g * 587 + b * 114) / 1000;
        // Ensure brightness is above a certain threshold (128) for readability
      } while (brightness < 128);
    
      return color;
    };

    public createNewTask():TaskModel
    {
      const user = this.user.getValue()
      if (user == null) {throw Error("User is missing")}
      const id = uuid.v4().toString()
      const currentDate = new Date();
      const oneHourAhead = new Date(currentDate.getTime() + 3600000)

      const newRootTask = new TaskModel(id, user.id, id, [],[],"New Task", this.getRandomHexColor(),[],[],currentDate.toISOString(), oneHourAhead.toISOString(), false, {}, "", [], true);

      this.storeTaskOnFirestore(newRootTask)

      this.setSelectedTask(newRootTask)
      this.setTasks([...this.tasksArray.getValue(), newRootTask])
      return newRootTask
    }

    // Rerender the main view
    public getReRender(): PropertyListener<boolean> {
      return this.reRender;
    }

    public setReRender(bool: boolean): void {
        this.reRender.setValue(bool)
    }

    private storeTaskOnFirestore(task:TaskModel)
    {
      const taskPathArray = task.ancestors.map(task => task.id).reverse()
      const taskData:TaskData = {
        Color:task.color,
        Ancestors: task.ancestors.map(task => task.id),
        Children: task.children.map(task => task.id),
        Content: task.content,
        ContextFiles: task.contextFiles.map(doc => doc.name),
        UnobservedFiles: task.unobservedFiles.map(doc => doc.name),
        ContextText: task.contextText,
        CreatorID: task.creatorId,
        EndDate: task.endDate.toISOString(),
        ExtraMedia: task.extraMedia,
        ID: task.id,
        InvitedUsers: task.invitedUsers,
        IsMovable: task.isMovable,
        Notes: task.notes,
        StartDate: task.startDate.toISOString(),
        Title: task.title,
        Users: task.users.map(user => user.id),
        IsRoot: task.isRoot
      }
      addTask(taskData, taskPathArray)
    }

    public saveEditToTask(task:TaskModel)
    {
      this.debounce(this.saveChangesToTask, 1000)(task)
    }

    private saveChangesToTask(task:TaskModel)
    {
      const taskPathArray = task.ancestors.map(task => task.id).reverse()
      const taskData:TaskData = {
        Color:task.color,
        Ancestors: task.ancestors.map(task => task.id),
        Children: task.children.map(task => task.id),
        Content: task.content,
        ContextFiles: task.contextFiles.map(doc => doc.name),
        UnobservedFiles: task.unobservedFiles.map(doc => doc.name),
        ContextText: task.contextText,
        CreatorID: task.creatorId,
        EndDate: task.endDate.toISOString(),
        ExtraMedia: task.extraMedia,
        ID: task.id,
        InvitedUsers: task.invitedUsers,
        IsMovable: task.isMovable,
        Notes: task.notes,
        StartDate: task.startDate.toISOString(),
        Title: task.title,
        Users: task.users.map(user => user.id),
        IsRoot: task.isRoot
      }
      updateTask(taskData, taskPathArray)
    }

    private debounce(func: Function, delay: number){
      let timer: NodeJS.Timeout | null;
      return (...args: any[]) => {
          if (timer) {
              clearTimeout(timer);
          }
          timer = setTimeout(() => {
              func(...args);
              timer = null;
          }, delay);
      };
    }

    public uploadFileToTask(task:TaskModel, fileName:string)
    {
      
    }
  }

export default MainController