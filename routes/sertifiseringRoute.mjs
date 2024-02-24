// sertifiseringRoute.mjs

import express from 'express';
import User from '../modules/user.mjs';
import Verifisering from '../modules/verifisering.mjs';
import SuperLogger from '../modules/SuperLogger.mjs';
import autentisering from '../modules/autentisering.mjs';
import DBManager from '../modules/storageManager.mjs';
import { HTTPCodes } from '../modules/httpConstants.mjs';


const VERIFISERING_API = express.Router();
VERIFISERING_API.use(express.json()); 

// OPPRETTE BRUKER
VERIFISERING_API.post('/', async (req, res, next) => {
        console.log("Skjematikk mottatt fra bruker", req.body);                                                     
        const { lokasjon, antallKuberKontrollert, kontrollskjemaFulgt, funnLukketyngelråte, funnApenyngelråte, funnSteinyngel, funnLitenkubebille, funnVarroa, funnTrakemidd, egneNotater } = req.body;

    if (lokasjon && antallKuberKontrollert && kontrollskjemaFulgt && funnLukketyngelråte && funnApenyngelråte && funnSteinyngel && funnLitenkubebille) {
        try {            
            // Opprett skjema
            let skjemaSertifisering = new skjemaSertifisering();
            skjemaSertifisering.lokasjon = lokasjon;
            skjemaSertifisering.antallKuberKontrollert = antallKuberKontrollert;
            skjemaSertifisering.kontrollskjemaFulgt = kontrollskjemaFulgt;
            skjemaSertifisering.funnLukketyngelråte = funnLukketyngelråte;
            skjemaSertifisering.funnApenyngelråte = funnApenyngelråte;
            skjemaSertifisering.funnSteinyngel = funnSteinyngel;
            skjemaSertifisering.funnLitenkubebille = funnLitenkubebille;
            skjemaSertifisering.funnVarroa = funnVarroa;
            skjemaSertifisering.funnTrakemidd = funnTrakemidd;
            skjemaSertifisering.egneNotater = egneNotater;

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