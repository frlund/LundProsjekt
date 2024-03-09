// user.mjs


import DBManager from "./storageManager.mjs";


class User {
  constructor() {    
    this.email;
    this.pswHash;
    this.name;
    this.fylke;
    this.id;
    this.admin;
  }

  
  setPassword(password) {
    this.pswHash = password;
  }

  async save() {
    /// TODO: What happens if the DBManager fails to complete its task?
    // We know that if a user object dos not have the ID, then it cant be in the DB.
    if (this.id == null) {
      return await DBManager.createUser(this);
    } else {
      return await DBManager.updateUser(this);
    }
  }


  delete() {
    /// TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteUser(this);
  }

  async isKnownUser(){
    return await DBManager.userExists(this.email);
  }

};

export default User;