import PropertyListener from "../Listener";
import TaskModel from "../../models/TaskModel"; 

// This will control anything that happens inside Main view

class TaskViewController {
    // View Logic
    private viewInvitedUsers: PropertyListener<boolean> = new PropertyListener<boolean>(false);
  
    // Private constructor to prevent instantiation from outside
    constructor(task:TaskModel) {
      // Initialization code here
    }


    

    // TaskModel Logic

  
    // Static method to retrieve the single instance
  
    // Other methods and properties can be added as needed
    // Getter for the counter property
    public getViewInvitedUsers(): PropertyListener<boolean> {
        return this.viewInvitedUsers;
    }

    // Method to increase the counter value
    public setInvitedUsers(bool: boolean): void {
        this.viewInvitedUsers.setValue(bool)
    }
  }

export default TaskViewController