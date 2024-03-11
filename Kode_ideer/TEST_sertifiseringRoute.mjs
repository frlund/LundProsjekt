import express from 'express';
import DBManager from '../modules/storageManager.mjs';
import { HTTPCodes } from '../modules/httpConstants.mjs';

const SERTIFISERING_API = express.Router();
SERTIFISERING_API.use(express.json());

// Lagre skjema
SERTIFISERING_API.post('/', async (req, res, next) => {
    try {
        const { lokasjon, antallKuberKontrollert, kontrollskjemaFulgt, funnLukketyngelråte, funnApenyngelråte, funnSteinyngel, funnLitenkubebille, funnVarroa, funnTrakemidd, egneNotater } = req.body;

        // Sjekk om alle nødvendige felter er tilstede
        if (lokasjon && antallKuberKontrollert && kontrollskjemaFulgt && funnLukketyngelråte && funnApenyngelråte && funnSteinyngel && funnLitenkubebille) {
            // Lagre skjema
            const skjemaSertifisering = await DBManager.createskjemaSertifisering(req.body);
            res.status(HTTPCodes.Success.OK).json(skjemaSertifisering).end();
        } else {
            res.status(HTTPCodes.ClientError.BadRequest).send("Mangler nødvendig informasjon").end();
        }
    } catch (error) {
        console.error("Feil ved lagring av skjema:", error);
        res.status(HTTPCodes.ServerSideErrorResponse.InternalServerError).send("Feil ved lagring av skjema").end();
    }
});

export default SERTIFISERING_API;