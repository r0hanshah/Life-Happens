class TaskModel
{
    constructor(id:string, creatorId:string, users:UserModel[], invitedUsers:string[], title:string, ancestors:TaskModel[], children:TaskModel[], startDate:string, endDate:string, isMovable:boolean, content:{[key:string]:any}, notes:string, extraMedia:string[], isRoot:boolean, contextText:string, contextFiles:string[])
    {
        this.id = id
        this.creatorId = creatorId
        this.users = users
        this.invitedUsers = invitedUsers

        this.title = title
        this.ancestors = ancestors
        this.children = children
        this.startDate = startDate
        this.endDate = endDate

        this.isMovable = isMovable
        this.content = content
        this.notes = notes
        this.extraMedia = extraMedia
        this.isRoot = isRoot

        this.contextText = contextText
        this.contextFiles = contextFiles
    }

    id:string
    creatorId:string
    users:UserModel[]
    invitedUsers:string[]

    title:string
    ancestors:TaskModel[]
    children:TaskModel[]
    startDate:string
    endDate:string
    
    isMovable:boolean 
    content:{[key:string]:any}
    notes:string 
    extraMedia:string[]
    isRoot:boolean

    contextText:string
    contextFiles:string[]
}