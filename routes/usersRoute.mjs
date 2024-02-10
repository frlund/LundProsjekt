import express from "express";
import pool from '../server.mjs';
import server from '../server.mjs';
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import bcrypt from 'bcrypt'; // FL - Importerer bcrypt for passordhashing
import SuperLogger from "../modules/SuperLogger.mjs";


const USER_API = express.Router(); 
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

const users = [];

USER_API.get('/', (req, res, next) => {
    SuperLogger.log("Demo of logging tool");
    SuperLogger.log("A important msg", SuperLogger.LOGGING_LEVELS.CRTICAL);
})

// Hente en bruker basert på ID
USER_API.get('/:id', (req, res, next) => {
    const userId = req.params.id;
        console.log('Requested user ID:', userId);
        console.log('Users array:', users);
    

    // Finn brukeren med matchende ID
    const user = users.find(user => user.id === parseInt(userId));
        console.log('Found user:', user);

    // Sjekk om brukeren ble funnet
    if (!user) {
        console.log('User not found');
        return res.status(404).json({ error: "Bruker ikke funnet" });
    }

    res.status(200).json(user);
});

// Opprett en ny bruker
USER_API.post('/', async (req, res, next) => {
    const { name, email, password, fylke } = req.body;
        console.log('Received data:', {name, email});

    try {
        // Utfør en SQL-setning for å sette inn brukerdataene i databasen
        const result = await pool.query(
            'INSERT INTO public."Users" (name, email, password, fylke) VALUES ($1, $2, $3, $4)',
            [name, email, password, fylke]
        );

        // Send en bekreftelsesmelding til klienten
        res.status(201).json({ message: 'Brukeren ble opprettet' });
    } catch (error) {
        console.error('Feil ved oppretting av bruker:', error);
        res.status(500).json({ error: 'Noe gikk galt under oppretting av bruker' });
    }
});


USER_API.put('/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(user => user.id === parseInt(userId));
        console.log('Found user:', user);

    const { name, email, password, fylke } = req.body;

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    user.name = name;
    user.password = password;
    user.fylke = fylke;
    user.email = email;

    users[users.indexOf(user)] = user;
});
// USER_API.GET??
USER_API.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);
    
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.pswHash);

    if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
});

USER_API.delete('/:id', (req, res) => {
    const userId = req.params.id;
    const user = users.find(user => user.id === parseInt(userId));

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    users.splice(users.indexOf(user), 1);
    res.status(200).json({ message: "User deleted successfully" });
});

export default USER_API;