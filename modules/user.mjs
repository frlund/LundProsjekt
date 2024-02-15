// user.mjs

import DBManager from "./storageManager.mjs";


class User {

  constructor() {
    ///TODO: Are these the correct fields for your project?
    this.email;
    this.pswHash;
    this.name;
    this.fylke;
    this.id;
  }

  async save() {

    console.log("User - Save");
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
}

export default User;