
import isAuthenticated  from './modules/autentisering.mjs';

// Bruk middleware
 server.get('/meny.html', isAuthenticated, (req, res) => {
    res.sendFile('../public/meny.html');
 });

 
//  Evt denne for verifisering
//  sessionStorage.setItem("user", JSON.stringify(respon));

//  sessionStorage.getItem("user");