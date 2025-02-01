import PropertyListener from "../Listener";
import TaskModel from "../../models/TaskModel"; 

import uuid from 'react-native-uuid'
import { Alert } from "react-native";
import UserModel from "../../models/UserModel";

import { addTask, updateTask, uploadFile, TaskData, deleteFile, deleteTask } from "../../services/taskServices";
import moment from "moment";

// This will control anything that happens inside Main view

class MainController {
    private static instance: MainController | null = null;
    private selectedTask: PropertyListener<TaskModel | null> = new PropertyListener<TaskModel | null>(null);
    private tasksArray: PropertyListener<TaskModel[]> = new PropertyListener<TaskModel[]>([]);
    private reRender: PropertyListener<boolean> = new PropertyListener<boolean>(false);
    private loading: PropertyListener<boolean> = new PropertyListener<boolean>(false);
    private user:PropertyListener<UserModel | null> = new PropertyListener<UserModel | null>(null);
    private displayMode:PropertyListener<number> = new PropertyListener<number>(0);
    // 0 : in calendar display
    // 1 : in week display
    // 2 : in day display
    private movingMoment:PropertyListener<moment.Moment> = new PropertyListener<moment.Moment>(moment());
    private toggledPopupKey:PropertyListener<string> = new PropertyListener<string>('');

    // Private constructor to prevent uploadFileinstantiation from outside
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

    public getToggledPopupKey():PropertyListener<string> {
      return this.toggledPopupKey
    }

    public setToggledPopupKey(key:string){
      this.toggledPopupKey.setValue(key)
    }

    public getMoment(): PropertyListener<moment.Moment> {
      return this.movingMoment
    }

    public setMoment(moment: moment.Moment) {
      this.movingMoment.setValue(moment)
    }

    public getDisplay(): PropertyListener<number> {
      return this.displayMode
    }

    public setDisplay(display:number){
      this.displayMode.setValue(display)
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

    private generateFilePaths(task:TaskModel) {
      var file_paths:string[] = []
      for (const doc of task.contextFiles)
      {
        const file_path = "Users/"+task.creatorId+"/"+task.ancestors.toReversed().map(task=>task.id).join('/')+task.id+"/"+doc.name
        file_paths.push(file_path)
      }
      return file_paths
    }

    public async handleGenerateTasks(task: TaskModel):Promise<TaskModel[]> {
      this.setLoadingGenerateTasks(true)
      try {
        const taskName = task.title
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
        const file_paths = this.generateFilePaths(task)

        const response = await fetch('http://127.0.0.1:5000/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "taskName": taskName,
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
        const user_id = this.getUser().getValue()?.id!
        for (const taskJSON of responseData)
        {
          taskModels.push(new TaskModel(undefined, user_id, task.rootId, [], [], taskJSON["title"], task.color, [task, ...task.ancestors], [], taskJSON["startDateISO"], taskJSON["endDateISO"], true,this.user.getValue()!.settings["allow_start_time_email_notif"],this.user.getValue()!.settings["allow_end_time_email_notif"], {}, taskJSON["notes"]))
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
      const id = uuid.v4().toString().replace(/-/g, "")
      const currentDate = new Date();
      const startDate = new Date(currentDate.getTime() + 30 * 60 * 1000)
      const oneHourAhead = new Date(startDate.getTime() + 3600000)

      const newRootTask = new TaskModel(id, user.id, id, [],[],"New Task", this.getRandomHexColor(),[],[],startDate.toISOString(), oneHourAhead.toISOString(), false,this.user.getValue()!.settings["allow_start_time_email_notif"],this.user.getValue()!.settings["allow_end_time_email_notif"], {}, "", [], true);

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

    public storeTaskOnFirestore(task:TaskModel)
    {
      const taskPathArray = task.ancestors.map(task => task.id).reverse()
      console.log('Task Path Array:', taskPathArray); // Log the taskPathArray to ensure it's correct
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
        StartNotify: task.startNotify,
        EndNotify: task.endNotify,
        Notes: task.notes,
        StartDate: task.startDate.toISOString(),
        Title: task.title,
        Users: task.users.map(user => user.id),
        IsRoot: task.isRoot,
        Completeness: task.completeness,
      }
      const user = this.getUser().getValue();
      if (user == null) {
        throw new Error("User is missing");
      }
    
      addTask(taskData, taskPathArray, user)
    }

    public deleteTaskOnFirestore(task:TaskModel)
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
        StartNotify: task.startNotify,
        EndNotify: task.endNotify,
        Notes: task.notes,
        StartDate: task.startDate.toISOString(),
        Title: task.title,
        Users: task.users.map(user => user.id),
        IsRoot: task.isRoot,
        Completeness: task.completeness
      }
      deleteTask(taskData, taskPathArray)
    }

    public saveEditToTask(task:TaskModel)
    {
      console.log("updating task...")
      this.setReRender(this.getReRender().getValue() ? false : true)
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
        StartNotify: task.startNotify,
        EndNotify: task.endNotify,
        Notes: task.notes,
        StartDate: task.startDate.toISOString(),
        Title: task.title,
        Users: task.users.map(user => user.id),
        IsRoot: task.isRoot,
        Completeness: task.completeness
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

    public async uploadFileToTask(task:TaskModel, file: {
        name: string;
        size: number | undefined;
        type: string;
        uri: string;
    })
    {
      const taskPathArray = task.ancestors.map(task => task.id).reverse()
      await uploadFile(task.creatorId, taskPathArray, task.id, file)
    }

    public async deleteFileFromTask(task:TaskModel, filename:string){
      const taskPathArray = task.ancestors.map(task => task.id).reverse()
      await deleteFile(task.creatorId, taskPathArray, task.id, filename)
    }
  }

export default MainController