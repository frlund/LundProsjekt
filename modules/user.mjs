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
    if (this.id == null) {
      return await DBManager.createUser(this);
    } else {
      return await DBManager.updateUser(this);
    }
  }


  delete() {
    DBManager.deleteUser(this);
  }

  async isKnownUser(){
    return await DBManager.userExists(this.email);
  }

};

export default User;