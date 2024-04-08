class TaskModel
{
    constructor(id:string, creatorId:string, rootId:string, users:UserModel[], invitedUsers:string[], title:string, color:string, ancestors:TaskModel[], children:TaskModel[], startDate:string, endDate:string, isMovable:boolean, content:{[key:string]:any}, notes:string, extraMedia:string[], isRoot:boolean, contextText:string, contextFiles:string[])
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

        this.offset = 0
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
    contextFiles:string[]

    isLeft:boolean = false
    //UI Aids
    offset:number

    isLeftBound():boolean {
        if (this.ancestors.length > 0)
        {
            return this.ancestors[this.ancestors.length-1].isLeft
        }
        return this.isLeft
    }
}

export default TaskModel