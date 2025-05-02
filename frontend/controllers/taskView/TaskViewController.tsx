import PropertyListener from "../Listener";
import TaskModel from "../../models/TaskModel";
import UserModel from "../../models/UserModel";
import { remove_email_notification, request_email_notification } from "../../services/taskServices";

// This will control anything that happens inside Task view

class TaskViewController {
    // View Logic
    private viewInvitedUsers: PropertyListener<boolean> = new PropertyListener<boolean>(false);
    private task: TaskModel

    // Spam preventions
    private start_toggle_lock:boolean = false
    private start_last_set:boolean = false
    private end_toggle_lock:boolean = false
    private end_last_set:boolean = false

    private complete_toggle_lock:boolean = false
    private complete_last_set:boolean = false

    private last_end_datetime_logged:null | Date = null
    private end_datetime_lock:boolean = false

    private last_start_datetime_logged:null | Date = null
    private start_datetime_lock:boolean = false
    
    private last_notes_logged:null | string = null
    private notes_state:string = ""
    private notes_lock:boolean = false

    private last_title_logged:null | string = null
    private title_state:string = ""
    private title_lock:boolean = false
  
    // Private constructor to prevent instantiation from outside
    constructor(task:TaskModel) {
      // Initialization code here
      this.task = task
    }

    // Manages when notifications are sent out
    public handle_toggle_notifications(set:boolean, user:UserModel, type: 'start_task' | 'end_task'): void {
      // Acquire lock
      if(type == 'start_task')
      {
        this.start_last_set = set
        if(this.start_toggle_lock)
          return
        else
          this.start_toggle_lock = true
      }
      
      if(type == 'end_task')
      {
        this.end_last_set = set
        if(this.end_toggle_lock) 
          return
        else
          this.end_toggle_lock = true
      }      
      
      setTimeout(() =>{
        if (type == 'start_task' ? this.start_last_set : this.end_last_set)
        {
          request_email_notification(this.task.toTaskData(), user, type)
        }
        else
        {
          remove_email_notification(user.id, this.task.id, type)
        }

        // Release lock
        if(type == 'start_task')
          this.start_toggle_lock = false
        
        if(type == 'end_task')
          this.end_toggle_lock = false
      }, 5000) // Trigger after 5 seconds
    }

    public handle_complete_toggle(set:boolean, user:UserModel): void {
      this.complete_last_set = set
      if(this.complete_toggle_lock)
        return
      else
        this.complete_toggle_lock = true

        setTimeout(()=>{
          if(this.complete_last_set)
          {
            remove_email_notification(user.id, this.task.id, 'start_task')
            remove_email_notification(user.id, this.task.id, 'end_task')
          }
        }, 5000)
    }

    public handle_notes_change(notes:string, user:UserModel) {
      this.notes_state = notes
      if(this.notes_lock)
        return
      else
      {
        this.notes_lock = true
        this.last_notes_logged = notes
      }
      setTimeout(()=>{
        this.notes_lock = false
        if (this.notes_state == this.last_notes_logged)
        {
          request_email_notification(this.task.toTaskData(), user, 'start_task', true)
          request_email_notification(this.task.toTaskData(), user, 'end_task', true)
        }
        else
        {
          this.last_notes_logged = this.notes_state
          this.handle_notes_change(notes, user)
        }
      },5000)
    }

    public handle_title_change(title:string, user:UserModel) {
      this.title_state = title
      if(this.title_lock)
        return
      else
      {
        this.title_lock = true
        this.last_title_logged = title
      }
      setTimeout(()=>{
        this.title_lock = false
        if (this.title_state == this.last_title_logged)
        {
          request_email_notification(this.task.toTaskData(), user, 'start_task', true)
          request_email_notification(this.task.toTaskData(), user, 'end_task', true)
        }
        else
        {
          this.last_title_logged = this.title_state
          this.handle_title_change(title, user)
        }
      },5000)
    }

    public handle_datetime_changes(year:number, month:number, day:number, hour:number, minute:number, which:'start' | 'end', user:UserModel)
    {
      if (which == 'start')
      {
        this.task.startDate.setFullYear(year)
        this.task.startDate.setMonth(month)
        this.task.startDate.setDate(day)
        this.task.startDate.setHours(hour)
        this.task.startDate.setMinutes(minute)

        if(this.start_datetime_lock)
          return
        else
          this.start_datetime_lock = true
      }
      else
      {
        this.task.endDate.setFullYear(year)
        this.task.endDate.setMonth(month)
        this.task.endDate.setDate(day)
        this.task.endDate.setHours(hour)
        this.task.endDate.setMinutes(minute)

        if(this.end_datetime_lock)
          return
        else
          this.end_datetime_lock = true
      }

      setTimeout(() => {
        if (which == 'start')
        {
          this.start_datetime_lock = false
          if(this.last_start_datetime_logged == null || this.last_start_datetime_logged.getTime() != this.task.startDate.getTime())
          {
            this.last_start_datetime_logged = this.task.startDate
            this.handle_datetime_changes(year, month, day, hour, minute, 'start', user)
          }
          else
          {
            request_email_notification(this.task.toTaskData(), user, "start_task", true)
          }
        }
        else
        {
          this.end_datetime_lock = false
          if(this.last_end_datetime_logged == null || this.last_end_datetime_logged.getTime() != this.task.endDate.getTime())
          {
            this.last_end_datetime_logged = this.task.endDate
            this.handle_datetime_changes(year, month, day, hour, minute, 'end', user)
          }
          else
          {
            request_email_notification(this.task.toTaskData(), user, "end_task", true)
          }
        }
      }, 10000);

    }
  
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