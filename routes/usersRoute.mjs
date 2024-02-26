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
    console.log('Innloggingsforespørsel mottatt:', { email });
    try {
        const user = await DBManager.validateUser(email, password);
        if (user) {
            console.log('Innlogging vellykket:', { email });
            res.status(200).json({ message: 'Innlogging vellykket', user }).end();
        } else {
            console.log('Feil brukernavn eller passord:', { email });
            res.status(401).json({ error: 'Feil brukernavn eller passord' }).end();
        }
    } catch (error) {
        console.error('Feil ved innlogging:', error);
        res.status(500).json({ error: 'Noe gikk galt ved innlogging' }).end();
    }
});

// OPPRETTE BRUKER
USER_API.post('/', async (req, res, next) => {
    console.log("Data mottatt fra bruker", req.body);                                                     
    const { name, email, password, fylke } = req.body;

    if (name && email && password) {
        try {            
            const emailExists = await DBManager.userExists(email);
            if (emailExists) {
                return res.status(HTTPCodes.ClientSideErrorRespons.Conflict).send("Eposten eksisterer allerede").end();
            }            
            let user = new User();
            user.name = name;
            user.email = email;
            user.fylke = fylke;
            // user.setPassword(password);
            user.pswHash = DBManager.hashPassword(password);

            user = await user.save();
            res.status(200).json(JSON.stringify(user)).end();

        } catch (error) {
            console.error("Feil ved oppretting av bruker:", error);
            res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Feil ved oppretting av bruker").end();
        }
    } else {
        res.status(400).send("Mangler nødvendig informasjon").end();
    }
});    

// FL -Middleware Autentisere BRUKERE på meny.html
USER_API.get('/meny.html', autentisering, (req, res) => {
    console.log('Bruker autentisert.');
    res.sendFile(__dirname + '/public/meny.html'); 
});

USER_API.get('/', (req, res, next) => {
    console.log("Test");
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})

    // HENTE BRUKER/INFO
    USER_API.get('/:id', async (req, res, next) => {
        console.log("Her ##############################");
        const user = await DBManager.getUser(req.params.id);
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
            res.status(200).json(updatedUser).end();
            // alert('Brukerdata er oppdatert!');     

            } catch (error) {
                console.error("Feil ved oppdatering av bruker:", error);
                res.status(500).json({ error: 'Feil ved oppdatering av brukerdata' }).end();
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