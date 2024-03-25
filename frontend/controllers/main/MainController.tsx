import PropertyListener from "./Listener";
import TaskModel from "../../models/TaskModel"; 

// This will control anything that happens inside Main view

class MainController {
    private static instance: MainController | null = null;
    private selectedTask: PropertyListener<TaskModel | null> = new PropertyListener<TaskModel | null>(null);
  
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
  }

export default MainController