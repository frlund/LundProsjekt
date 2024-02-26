//SERVER.mjs

import 'dotenv/config' 
import express from 'express';
import USER_API from './routes/usersRoute.mjs';
import SuperLogger from './modules/SuperLogger.mjs';
import DBManager from './modules/storageManager.mjs';
import session from 'express-session';
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";


printDeveloperStartupInportantInformationMSG();

// Server
const server = express();
const port = (process.env.PORT || 8080);
server.use(express.json());
server.set('port', port);

const logger = new SuperLogger(); // Enable logging for server
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests

server.use(session({ // FL- middleware for autentisering
    secret: 'hemmelig', // Dette bør være en unik og sikker verdi
    resave: false,
    saveUninitialized: true
}));

server.use(express.static('public')); // Defining a folder that will contain static files.

server.use("/user", USER_API); // Telling the server to use the USER_API (all urls that uses this codewill have to have the /user after the base address)

server.get("/", (req, res, next) => { // A get request handler example)
    SuperLogger.log('Get request received for /', SuperLogger.LOGGING_LEVELS.IMPORTANT);
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

// LAGRE SKJEMA SERTIFISERING
server.post("/saveForm", async (req, res) => {
    const formData = req.body;

    try {
        await DBManager.createskjemaSertifisering(formData);
        res.status(200).send("Skjemadata er lagret.").end();
    } catch (error) {
        console.error("Feil ved lagring av skjemadata:", error);
        res.status(500).send("Feil ved lagring av skjemadata.").end();
        return;
    }
});

// //Hente skjemadata
server.get("/skjemaer/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        // Hent skjemadata fra databasen basert på userId
        const skjemaer = await DBManager.getSkjemaerForUser(userId);
        res.status(200).json(skjemaer);
    } catch (error) {
        console.error("Feil ved henting av skjemadata:", error);
        res.status(500).send("Feil ved henting av skjemadata.").end();
    }
});



server.listen(server.get('port'), function () { // Start the server 
    console.log('server running', server.get('port'));
});
