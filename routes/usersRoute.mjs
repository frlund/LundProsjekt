// userRoute.mjs
import crypto from 'crypto';
import express from 'express';
import User from '../modules/user.mjs';
import SuperLogger from '../modules/SuperLogger.mjs';
import autentisering from '../modules/autentisering.mjs';
import DBManager from '../modules/storageManager.mjs';
import { HTTPCodes } from '../modules/httpConstants.mjs';


const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

// logge inn bruker
USER_API.post('/login', async (req, res) => {
    const { email, password } = req.body;
    SuperLogger.log('POST: Innloggingsforespørsel mottatt:', SuperLogger.LOGGING_LEVELS.IMPORTANT);
    try {
        const user = await DBManager.validateUser(email, password);
        if (user) {
            SuperLogger.log(`Login success- user: ${email}`, SuperLogger.LOGGING_LEVELS.IMPORTANT);
            res.status(200).json({ message: 'Login successful', user }).end();
        } else {
            SuperLogger.log(`UserLogin failed for user: ${email}`, SuperLogger.LOGGING_LEVELS.ALL);
            res.status(401).json({ error: 'Incorrect email or password' }).end();
        }
    } catch (error) {
        SuperLogger.log(`Error login for user: ${email}, Error: ${error}`, SuperLogger.LOGGING_LEVELS.CRITICAL);
        res.status(500).json({ error: 'USERS login error' }).end();
    }
});

// OPPRETTE BRUKER
USER_API.post('/', async (req, res, next) => {
    // console.log("Data mottatt fra bruker", req.body);
    SuperLogger.log("POST: Data recived from user...", SuperLogger.LOGGING_LEVELS.IMPORTANT);                                                     
    const { name, email, password, fylke } = req.body;

    if (name && email && password) {
        try {            
            const emailExists = await DBManager.userExists(email);
            if (emailExists) {
                SuperLogger.log('POST: emailExits', SuperLogger.LOGGING_LEVELS.IMPORTANT);
                return res.status(HTTPCodes.ClientSideErrorRespons.Conflict).send("Eposten eksisterer allerede").end();
            }            
            let user = new User();
            user.name = name;
            user.email = email;
            user.fylke = fylke;
            user.pswHash = DBManager.hashPassword(password);

            user = await user.save();
            SuperLogger.log('POST: New user', SuperLogger.LOGGING_LEVELS.CRITICAL);
            res.status(200).json(JSON.stringify(user)).end();

        } catch (error) {
            SuperLogger.log('Error - user not created ' + error.message, SuperLogger.LOGGING_LEVELS.CRITICAL);
            // console.error("Error - user not created", error);
            res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Error - user not created").end();
        }
    } else {
        SuperLogger.log('Missing user INFO (create user))', SuperLogger.LOGGING_LEVELS.CRITICAL);
        res.status(HTTPCodes.ClientSideErrorResponse.BadRequest).send("Missing userInformation").end();
    }
});    

// FL -Middleware Autentisere BRUKERE på meny.html
USER_API.get('/meny', autentisering, (req, res) => {
    console.log('Bruker autentisert.');
    res.redirect('/meny.html');
    
});

// Logg  BrukerInnlogging succsess
USER_API.use((req, res, next) => {
    // SuperLogger.log(`Login: ${req.method} ${req.originalUrl} av bruker: ${req.user.email}`, SuperLogger.LOGGING_LEVELS.CRITICAL););
    next();
});

// Logg  BrukerInnlogging ERROR
USER_API.use((err, req, res, next) => {
    SuperLogger.log(`ERROR login: ${err.message}`, SuperLogger.LOGGING_LEVELS.CRITICAL);
    res.status(403).json({ error: 'Tilgang nektet' }).end();
});


USER_API.get('/userlist', async (req, res, next) => {
    try {
        const users = await DBManager.getAllUsers();
            res.status(200).json(users);
    } catch (error) {
        console.error("Feil ved henting av brukere:", error);
            res.status(500).send("Feil ved henting av brukere.").end();
    }
})

    // HENTE BRUKER/INFO
    USER_API.get('/:id', async (req, res, next) => {
        const userId = req.params.id;
        
        req.session.userId = userId;
        // console.log("userId:", userId);
        const user = await DBManager.getUser(userId);
        res.status(200).json(JSON.stringify(user)).end();
    });

    // TODO Oppdater BRUKER    
    USER_API.put('/:id', async (req, res) => {
        try {
            const {id, name, email, password, fylke } = req.body;
            const pswHash = DBManager.hashPassword(password);
    
            const updatedUserData = {
                id,
                name,
                email,
                password: pswHash,
                fylke
            };
    
            const updatedUser = await DBManager.updateUser(updatedUserData);    
            res.status(200).json(updatedUser);
            // alert('Brukerdata oppdatert!');     

            } catch (error) {
                console.error("Feil ved oppdatering av bruker:", error);
                res.status(500).json({ error: 'Feil ved oppdatering av brukerdata' });
            }
        });

        USER_API.delete('/:id', async (req, res) => {      
          try {  
            const user = {};
            user.id = req.params.id;
            const updatedUser = await DBManager.deleteUser(user);
            res.status(200).json({ msg: "ok" }).end();   
           
        } catch (error) {
            console.error("Feil ved sletting av bruker:", error);
            res.status(500).json({ error: 'Feil ved sletting av bruker' }).end();
        }
    });

export default USER_API