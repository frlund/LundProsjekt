import pg from "pg";




/// TODO: is the structure / design of the DBManager as good as it could be?

/*

const DBMANAGER = function (connectionString) {
    return {
        connectionString ,
        updateUser: async function (user) {
            
        }
    }
}*/

class DBManager {

    #credentials = {};

    constructor(connectionString) {

        

        console.log(this.#credentials);
        this.#credentials = {
            connectionString,
            ssl: false
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

    async userExists(email) {
       // const credentials = DBManager.getCredentials();
        const client = new pg.Client(this.#credentials);
        
        try {
            await client.connect();
            const query = 'SELECT COUNT(*) FROM "public"."Users" WHERE email = $1::Text;';
            const result = await client.query(query, [email]);
            const count = parseInt(result.rows[0].count);
            return count > 0; 
        } catch (error) {
            console.error("Feil ved sjekking av brukerens eksistens:", error);
            return false;
        } finally {
            client.end(); // Alltid koble fra databasen
        }
    }
}

// Sjekk om brukeren finne i DB vi epost


// We are using an enviorment variable to get the db credentials 
if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
}

//export default DBMANAGER;
export default new DBManager(process.env.DB_CONNECTIONSTRING);

