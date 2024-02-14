import 'dotenv/config'; 
import express from 'express';
import USER_API from './routes/usersRoute.mjs';
import SuperLogger from './modules/SuperLogger.mjs';
// import httpConstants from "../modules/httpConstants.mjs";
import pg from 'pg';
// import autentisering  from './modules/autentisering.mjs'
// import printDeveloperStartupInportantInformationMSG from"./modules/developerHelpers.mjs;

// printDeveloperStartupInportantInformationMSG ();


// Server
const server = express();
const port = (process.env.PORT || 8080);
server.set('port', port);



// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests


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

// FL- loggInn.html Sjekker bruker videre mot DB
server.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await DBManager.validateUser(email, password);

        if (user) {
            res.status(HTTPCodes.SuccesfullRespons.Ok).json({ message: 'Innlogging vellykket', user }).end();
        } else {
            res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).json({ error: 'Feil brukernavn eller passord' }).end();
        }
    } catch (error) {
        console.error('Feil ved innlogging:', error);
        res.status(HTTPCodes.ServerSideErrorRespons.InternalServerError).json({ error: 'Noe gikk galt ved innlogging' }).end();
    }
});