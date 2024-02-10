
import isAuthenticated  from './modules/autentisering.mjs';

// Bruk middleware
 server.get('/meny.html', isAuthenticated, (req, res) => {
    res.sendFile('../public/meny.html');
 });

 