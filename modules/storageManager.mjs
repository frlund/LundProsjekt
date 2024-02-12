import pg from "pg"
import SuperLogger from "./SuperLogger.mjs";

// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {

    #credentials = {};

    constructor(connectionString) {
        console.log(this.#credentials);

        this.#credentials = {
            connectionString,
            // ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
            ssl: false
        };
    }

    async getUser(id) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('select * from "public"."Users" where id = $1;', [id]);
            console.log(output.rows[0]);
            return output.rows[0];
        } catch(error) {
            console.error("Feil under lasting av bruker");
        } finally {
            client.end(); // Always disconnect from the database.
        }
    }

    async updateUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }

    async deleteUser(user) {

        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?

        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async createUser(user) {
        console.log(this.#credentials);
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password", "fylke") VALUES($1::Text, $2::Text, $3::Text, $4::Text) RETURNING id;', [user.name, user.email, user.pswHash, user.fylke]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;

    }

}








export default new DBManager(process.env.DB_CONNECTIONSTRING);

//