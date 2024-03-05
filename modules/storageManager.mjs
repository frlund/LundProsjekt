import pg from 'pg';
import crypto from 'crypto';
import SuperLogger from "./SuperLogger.mjs";
import skjemaSertifisering from './skjemaSertifisering.mjs';


if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

class DBManager {
    #credentials = {};
    constructor(connectionString) {
        console.log(this.#credentials);
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : true
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
            SuperLogger.log(`Error "loading"" user: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
            throw error;
            
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
            SuperLogger.log(`Error checking user exists: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
            throw error;
        } finally {
            client.end(); // Always disconnect from the database.
        }
    }

    // OPPDATERE BRUKER I DB
    async updateUser(user) {
        const client = new pg.Client(this.#credentials);
        try {
            await client.connect();
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "fylke" = $5, "password" = $3 where id = $4;', [user.name, user.email, user.password, user.id, user.fylke]);
            //const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);
            
            console.log("Rows affected:", output.rowCount);
            if (output.rowCount === 0) {
                console.error("No rows were updated"); // Logg ROWS hvis ingen rader ble oppdatert
                throw new Error("No rows were updated");
            }
            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.
            //TODO Did we update the user?

        } catch (error) {
            SuperLogger.log(`Error updating user: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
            throw error;
             
        } finally {
            client.end(); 
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
            SuperLogger.log(`Error deleting user: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
            throw error;
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
          
            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }
        } catch (error) {
            SuperLogger.log(`Error creating user: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
            throw error;
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
            SuperLogger.log(`Error validating user: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
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

            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }

        } catch (error) {
            SuperLogger.log(`Error createVerifisering: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
            throw error;
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    } 

    async createskjemaSertifisering(formData) {
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect(); 
            const {
                userId,
                bigardnummer,
                lokasjon,
                dato,
                kontroll,
                skjema,
                yngelrate_lukket,
                yngelrate_apen,
                steinyngel,
                kubebille,
                varroa,
                trakemidd,
                notater
            } = formData;          

            const query = `
                INSERT INTO "public"."skjemaSertifisering"(
                    "userId",
                    "bigardnummer",
                    "lokasjon",
                    "dato",
                    "kontroll",
                    "skjema",
                    "yngelrate_lukket",
                    "yngelrate_apen",
                    "steinyngel",
                    "kubebille",
                    "varroa",
                    "trakemidd",
                    "notater"
                ) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id; `;

            const output = await client.query(query, [
                userId,
                bigardnummer,
                lokasjon,
                dato,
                kontroll,
                skjema,
                yngelrate_lukket,
                yngelrate_apen,
                steinyngel,
                kubebille,
                varroa,
                trakemidd,
                notater
            ]);

            if (output.rows.length === 1) {
                const sertifiseringId = output.rows[0].id;
                return { id: sertifiseringId, ...formData };
            } else {
                throw new Error("No rows were inserted");
            }
        } catch (error) {
            SuperLogger.log(`Error creating sertifisering: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
            throw error;
        } finally {
            client.end();
        }
    }

    async getSkjemaerForUser(userId) {
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."skjemaSertifisering" WHERE "userId" = $1;', [userId]);
            return output.rows;
        } catch (error) {
            SuperLogger.log(`Error fetching skjemadata for user: ${error}`, SuperLogger.LOGGING_LEVELS.ERROR);
            throw error;
        } finally {
            client.end();
        }
    }
    

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


export default new DBManager(process.env.DB_CONNECTIONSTRING);
