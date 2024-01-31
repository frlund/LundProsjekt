import express from "express";
import User from "../modules/user.mjs"; // Importerer User-klassen for å håndtere brukerdata
import HttpCodes from "../modules/httpErrorCodes.mjs"; // Importerer HTTP-feilkoder for responsbehandling
import bcrypt from 'bcrypt'; // Importerer bcrypt for passordhashing
import jwt from 'jsonwebtoken'; // Importerer jwt for å generere og verifisere JSON Web Tokens

const USER_API = express.Router(); // Oppretter en ny instans av Express Router
const users = []; // Oppretter en tom array for å lagre brukerdata

const secretKey = 'your_secret_key'; // Definerer en hemmelig nøkkel for å signere JWT

// Generer JWT når en bruker logger inn
function generateToken(user) {
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    return token;
}

// Verifiser JWT
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Missing token' });
    }

    jwt.verify(token, secretKey, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        } else {
            req.user = decodedToken; // Lagrer dekodet token i forespørselen for senere bruk
            next(); // Fortsetter med neste midlertidig i Express middleware-kjeden
        }
    });
}

// Hente en bruker basert på ID
USER_API.get('/:id', (req, res) => {
    const userId = req.params.id;
    console.log('Requested user ID:', userId);

    // Finn brukeren med matchende ID
    const user = users.find(user => user.id === parseInt(userId));
    console.log('Found user:', user);

    // Sjekk om brukeren ble funnet
    if (!user) {
        console.log('User not found');
        return res.status(404).json({ error: "Bruker ikke funnet" });
    }

    // Returner brukerobjektet
    res.status(200).json(user);
});

// Opprett en ny bruker
USER_API.post('/', async (req, res) => {
    // Destructure request body
    const { name, email, password } = req.body;

    // Sjekk om alle påkrevde felt er tilstede
    if (!name || !email || !password) {
        return res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

    try {
        // Hash passordet før lagring
        const hashedPassword = await bcrypt.hash(password, 10);

        // Opprett en ny bruker
        const newUser = new User();
        newUser.name = name;
        newUser.email = email;
        newUser.pswHash = hashedPassword; // Lagre det hasjede passordet

        // Legg til den nye brukeren i arrayen
        users.push(newUser);

        // Generer JWT for den nye brukeren
        const token = generateToken(newUser);

        // Returner en respons med JWT og den nye brukeren
        res.status(HttpCodes.SuccesfullRespons.Ok).json({ user: newUser, token });
    } catch (error) {
        // Håndter feil ved hashing av passord
        console.error("Feil ved passordhashing:", error);
        return res.status(HttpCodes.ServerError.InternalServerError).send("Feil under passordhashing").end();
    }
});

// Rediger en eksisterende bruker
USER_API.put('/:id', (req, res) => {
    /// TODO: Implementer logikk for å redigere en bruker
});

// Slett en bruker
USER_API.delete('/:id', (req, res) => {
    /// TODO: Implementer logikk for å slette en bruker
});

export default USER_API;
