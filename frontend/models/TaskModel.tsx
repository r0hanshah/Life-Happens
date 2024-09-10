import { DocumentPickerAsset } from "expo-document-picker"
import uuid from 'react-native-uuid';
import UserModel from "./UserModel";

class TaskModel
{
    constructor(id:string = uuid.v4().toString(), creatorId:string, rootId:string, users:UserModel[], invitedUsers:string[] = [], title:string, color:string, ancestors:TaskModel[], children:TaskModel[] = [], startDate:string, endDate:string, isMovable:boolean, content:{[key:string]:any} = {}, notes:string = "", extraMedia:string[] = [], isRoot:boolean = false, contextText:string = "", contextFiles:DocumentPickerAsset[] = [], unobservedFiles:DocumentPickerAsset[] = [])
    {
        this.id = id
        this.creatorId = creatorId
        this.rootId = rootId

        this.users = users
        this.invitedUsers = invitedUsers

        this.title = title
        this.color = color
        this.ancestors = ancestors
        this.children = children
        this.startDate = new Date(startDate)
        this.endDate = new Date(endDate)

        this.isMovable = isMovable
        this.content = content
        this.notes = notes
        this.extraMedia = extraMedia
        this.isRoot = isRoot

        this.contextText = contextText
        this.contextFiles = contextFiles
        this.unobservedFiles = unobservedFiles

        this.offset = 0
        this.y = ancestors.length
    }

    id:string
    creatorId:string
    rootId:string
    users:UserModel[]
    invitedUsers:string[]

    title:string
    color:string
    ancestors:TaskModel[]
    children:TaskModel[]
    startDate:Date
    endDate:Date
    
    isMovable:boolean 
    content:{[key:string]:any}
    notes:string 
    extraMedia:string[]
    isRoot:boolean

    contextText:string
    contextFiles:DocumentPickerAsset[]
    unobservedFiles:DocumentPickerAsset[]

    isLeft:boolean = false
    completeness:number = 0

    //UI Aids
    offset:number
    rootIndex:number = 0
    x=0
    y=0
    mod=0

    isLeftMost(): boolean {
        return this.ancestors.length === 0 || this.ancestors[0].children[0] === this;
    }

    getPreviousSibling(): TaskModel | null {
        if (this.isLeftMost()) return null;
        const siblings = this.ancestors[0].children;
        return siblings[siblings.indexOf(this) - 1];
    }

    getFirstChild(): TaskModel {
        return this.children[0];
    }

    getLastChild(): TaskModel {
        return this.children[this.children.length - 1];
    }

    isLeftBound():boolean {
        if (this.ancestors.length > 0)
        {
            return this.ancestors[this.ancestors.length-1].isLeft
        }
        return this.isLeft
    }

    getPercentCompleteness():number {
        var percentCompleteness = this.traverse(this)
        return percentCompleteness
    }

    private traverse(task:TaskModel):number {
        if (task.children.length == 0)
        {
            return task.completeness
        }

        var completeness:number = 0
        const taskDuration:number = this.getDurationOfTask(task)
        for(const subtask of task.children)
        {
            completeness += this.traverse(subtask) * (subtask.getDateDifferenceInMinutes(subtask.startDate, subtask.endDate) / taskDuration)
        }
        return completeness
    }

    private getDurationOfTask(task:TaskModel):number
    {
        var sum = 0
        for(const child of task.children)
        {
            sum += this.getDateDifferenceInMinutes(child.startDate, child.endDate)
        }  
        return sum 
    }

    private getDateDifferenceInMinutes(startDate:Date, endDate:Date) {
        // Convert both dates to minutes
        const startMinutes = startDate.getTime() / (1000 * 60);
        const endMinutes = endDate.getTime() / (1000 * 60);
      
        // Calculate the difference in minutes
        const differenceMinutes = Math.abs(endMinutes - startMinutes);
      
        return differenceMinutes;
      }

}

export default TaskModel