import pg from "pg";
import crypto from 'crypto';

// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

class DBManager {
    #credentials = {};
    constructor(connectionString) {
        console.log(this.#credentials);
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };
    }

    getCredentials() {
        return this.#credentials;
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

    async userExists(email) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const output = await client.query('select * from "public"."Users" where email = $1;', [email]);
            console.log(output.rows[0]);
            return output.rows.length > 0;
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

    async validateUser(email, password) {
        const client = new pg.Client(this.#credentials);

        const hashedPassword = this.hashPassword(password);

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Users" WHERE email = $1 AND password = $2;', [email, hashedPassword]);
            return output.rows[0]; 
        } catch(error) {
            console.error("Feil under validering av bruker:", error);
            throw error; 
        } finally {
            client.end(); 
        }
    }

    async createVerifisering(userId, verifisering) {
        console.log(this.#credentials);
        const client = new pg.Client(this.#credentials);

        const verifiseringString = JSON.stringify(verifisering);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Verifisering"("date", "userId", "file") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [new Date(), userId, verifiseringString]);

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

    // hashe passord, crypto sha256
  hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
  }

}

// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

//export default DBMANAGER;
export default new DBManager(process.env.DB_CONNECTIONSTRING);
