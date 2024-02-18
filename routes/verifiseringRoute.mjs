// userRoute.mjs
import crypto from 'crypto';
import express from 'express';
import User from '../modules/user.mjs';
import Verifisering from '../modules/verifisering.mjs';
import SuperLogger from '../modules/SuperLogger.mjs';
import autentisering from '../modules/autentisering.mjs';
import DBManager from '../modules/storageManager.mjs';
import { HTTPCodes } from '../modules/httpConstants.mjs';


const VERIFISERING_API = express.Router();
VERIFISERING_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

// OPPRETTE BRUKER
VERIFISERING_API.post('/', async (req, res, next) => {
    console.log("Data mottatt fra bruker", req.body);                                                     
    // const { name, email, password, fylke } = req.body;
    const {bigardnummer, lokasjon /*, ...*/} = req.body;

    if (bigardnummer && lokasjon /*&& ...*/) {
        try {
            let verifisering = new Verifisering();
            
            // let user = new User();
            // user.name = name;
            // user.email = email;
            // user.fylke = fylke;
            // // user.setPassword(password);
            // user.pswHash = DBManager.hashPassword(password);

            // user = await user.save();
            // res.status(200).json(JSON.stringify(user)).end();

        } catch (error) {
            console.error("Feil ved oppretting av verifisering:", error);
            res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Feil ved oppretting av verifisering").end();
        }
    } else {
        res.status(400).send("Mangler nødvendig informasjon").end();
    }
});    


// USER_API.get('/:id', async (req, res, next) => {
//     console.log("Her ##############################");
//     const user = await DBManager.getUser(req.params.id);
//     res.status(200).json(JSON.stringify(user)).end();
// });

export default VERIFISERING_API