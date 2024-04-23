class UserModel
{
    constructor (id:string, name:string, profilePhotoURL:string, email:string ) // TODO: Add other attributes
    {
        this.id = id
        this.name = name
        this.profilePhotoURL = profilePhotoURL
        this.email = email
    }

    id:string
    name:string
    email:string
    profilePhotoURL:string
}

export default UserModel