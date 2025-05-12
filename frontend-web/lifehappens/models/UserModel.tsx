export const REST_PERIOD_DEFAULT = [
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false],
  ]

class UserModel
{
    constructor (id:string, name:string, profilePhotoURL:string, email:string, restPeriods:boolean[][] = REST_PERIOD_DEFAULT, settings:Record<string,boolean> = {}) // TODO: Add other attributes
    {
        this.id = id
        this.name = name
        this.profilePhotoURL = profilePhotoURL
        this.email = email
        this.restPeriods = restPeriods
        this.settings = settings
    }

    id:string
    name:string
    email:string
    profilePhotoURL:string
    restPeriods:boolean[][]
    settings:Record<string,boolean>
}

export default UserModel