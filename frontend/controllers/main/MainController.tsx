import PropertyListener from "../Listener";
import TaskModel from "../../models/TaskModel"; 

import uuid from 'react-native-uuid'

// This will control anything that happens inside Main view

class MainController {
    private static instance: MainController | null = null;
    private selectedTask: PropertyListener<TaskModel | null> = new PropertyListener<TaskModel | null>(null);
    private reRender: PropertyListener<boolean> = new PropertyListener<boolean>(false);

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
    // Getter for the counter property
    public getSelectedTask(): PropertyListener<TaskModel | null> {
        return this.selectedTask;
    }

    // Method to increase the counter value
    public setSelectedTask(selectedTask: TaskModel | null): void {
        this.selectedTask.setValue(selectedTask)
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

    public createNewTask(creatorId:string):TaskModel
    {
      const id = uuid.v4().toString()
      const currentDate = new Date();
      const oneHourAhead = new Date(currentDate.getTime() + 3600000)
      const newRootTask = new TaskModel(id, creatorId, id, [],[],"New Task", this.getRandomHexColor(),[],[],currentDate.toISOString(), oneHourAhead.toISOString(), false, {}, "", [], true);
      this.setSelectedTask(newRootTask)
      return newRootTask
    }

    // Rerender the main view
    public getReRender(): PropertyListener<boolean> {
      return this.reRender;
    }

    public setReRender(bool: boolean): void {
        this.reRender.setValue(bool)
    }
  }

export default MainController