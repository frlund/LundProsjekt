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


USER_API.get('/:id', async (req, res, next) => {
    console.log("Her ##############################");
    const user = await DBManager.getUser(req.params.id);
    res.status(200).json(JSON.stringify(user)).end();
});
    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object


// This is using javascript object destructuring.
// Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
// https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/



    // TODO Oppdater BRUKER
USER_API.put('/:id', (req, res) => {
    const { id, name, email, password, fylke } = req.body;

    const user = new User(); //TODO: The user info comes as part of the request

    user.email = email;
    user.fylke = fylke;
    user.navn = name;
    user.id = id;
    user.pswHash = DBManager.hashPassword(password);
    user.save();
});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
    const user = new User(); //TODO: Actual user

    // TODO: Hente ut id fra URL
    const params = req.params;
    user.id = params["id"];

    user.delete();
});

export default USER_API