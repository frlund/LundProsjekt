// user.mjs
import DBManager from "./storageManager.mjs";

class User {

    constructor() {
        ///TODO: Are these the correct fields for your project?
        this.id;
        this.email;
        this.pswHash;
        this.name;
        this.fylke
    }



async save() {
   
    if (this.id == null) {
        return await DBManager.createUser(this);
    } else {
        return await DBManager.updateUser(this);
        }
    }

async delete() {
    // TODO: What happens if the DBManager fails to complete its task?
    await DBManager.deleteUser(this);
    }
}


export default User;