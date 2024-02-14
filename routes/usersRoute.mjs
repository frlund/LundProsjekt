import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import pg from "pg"
import DBManager from "../modules/storageManager.mjs";
import { userExists } from "../modules/storageManager.mjs";


const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];

USER_API.get('/', (req, res, next) => {
    console.log("Test");
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})


USER_API.get('/:id', async (req, res, next) => {
    console.log("Her");
    const user = await DBManager.getUser(req.params.id);
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)

    /// TODO: 
    // Return user object


})

USER_API.post('/', async (req, res, next) => {
    console.log("Data mottatt fra bruker", req.body);

                                                        // This is using javascript object destructuring.
                                                        // Recomend reading up https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#syntax
                                                        // https://www.freecodecamp.org/news/javascript-object-destructuring-spread-operator-rest-parameter/

    const { name, email, password, fylke } = req.body;

    if (name && email && password) {
        try {
            // Sjekker om brukeren allerede eksisterer
            const userAlredyExists = await userExists(email);
            if (userAlredyExists) {
                return res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Eposten eksisterer allerede").end();
            }

            // Oppretter en ny bruker
            let user = new User();
            user.name = name;
            user.email = email;
            user.fylke = fylke;
            user.pswHash = password; // Husk å kryptere passordet!

            // Lagrer den nye brukeren i databasen
            user = await user.save();

            // Sender tilbake den opprettede brukeren som respons
            res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
        } catch (error) {
            console.error("Feil ved oppretting av bruker:", error);
            res.status(HTTPCodes.ServerErrorResponse.InternalServerError).send("Feil ved oppretting av bruker").end();
            // res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Feil ved oppretting av bruker").end();
        }
    } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler nødvendig informasjon").end();
    }
});


    // if (name != "" && email != "" && password != "") {
    //     let user = new User();
    //     user.name = name;
    //     user.email = email;
    //     user.fylke = fylke;
        

    //     ///TODO: Do not save passwords.
    //     user.pswHash = password;

    //     ///TODO: Does the user exist?
    //     let exists = false;

    //     if (!exists) {
    //         //TODO: What happens if this fails?
    //         user = await user.save();
    //         res.status(HTTPCodes.SuccesfullRespons.Ok).json(JSON.stringify(user)).end();
    //     } else {
    //         res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
    //     }

    // } else {
    //     res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    // }



USER_API.put('/:id', (req, res) => {
    /// TODO: Edit user
    const user = new User(); //TODO: The user info comes as part of the request 
    user.save();
});

USER_API.delete('/:id', (req, res) => {
    /// TODO: Delete user.
    const user = new User(); //TODO: Actual user
    user.delete();
});

export default USER_API