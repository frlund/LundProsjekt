import 'dotenv/config'
import express from 'express';
import USER_API from './routes/usersRoute.mjs';
import SuperLogger from './modules/SuperLogger.mjs';
import pg from 'pg';
// import autentisering  from './modules/autentisering.mjs'


// Server
const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);

// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests

                                            // Autentisering
                                            // const autentisert = new autentisering();
                                            // server.use(autentisert.isAuthenticated()); 

// Defining a folder that will contain static files.z
server.use(express.static('public'));


// Telling the server to use the USER_API (all urls that uses this codewill have to have the /user after the base address)
server.use("/user", USER_API);

// A get request handler example)
server.get("/", (req, res, next) => {
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});

//DBkommunikasjon
// import databaseConfig from './OldArkiv/DBconfig.mjs';
// const { Pool } = pg; 
// const pool = new Pool(databaseConfig);

// pool.query('SELECT NOW()', (err, res) => {
//     if (err) {
//         console.error('Feil ved tilkobling til DB:', err);
//     } else {
//         console.log('Tilkobling DB vellykket! Tidspunkt:', res.rows[0].now);
//     }

//     pool.connect((err, client, release) => {
//         if (err) {
//             return console.error('Feil ved tilkobling til DB:', err);
//         }
//         console.log('Tilkobling DB vellykket!');
//         release();
//     });
// });

// export default {pool};