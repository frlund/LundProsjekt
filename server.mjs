//SERVER.mjs

import 'dotenv/config' 
import express from 'express';
import USER_API from './routes/usersRoute.mjs';
import SuperLogger from './modules/SuperLogger.mjs';
import autentisering from './modules/autentisering.mjs';
import DBManager from './modules/storageManager.mjs';
import session from 'express-session';

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
    res.status(200).send(JSON.stringify({ msg: "These are not the droids...." })).end();
});

server.listen(server.get('port'), function () { // Start the server 
    console.log('server running', server.get('port'));
});