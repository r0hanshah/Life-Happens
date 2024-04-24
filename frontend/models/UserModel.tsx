class UserModel
{
    constructor (id:string, name:string, profilePhotoURL:string, email:string, restPeriods:boolean[][] = 
        [
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
     ) // TODO: Add other attributes
    {
        this.id = id
        this.name = name
        this.profilePhotoURL = profilePhotoURL
        this.email = email
        this.restPeriods = restPeriods
    }

    id:string
    name:string
    email:string
    profilePhotoURL:string
    restPeriods:boolean[][]
}

export default UserModel