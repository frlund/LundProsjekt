// Middleware, sjekk 
import path from 'path';

function isAuthenticated(req, res, next) {
    console.log('Sjekker autentisering...');

    if (req.session && req.session.userId) {
        console.log('Bruker er autentisert.');
        return next();
    } else {
        console.log('Ikke autentisert');
        return res.redirect('/index.html'); 
    }
}

export default function(app) {
    app.get('/meny.html', isAuthenticated, (req, res) => {
        console.log('Bruker autentisert.');
        res.sendFile(path.join(__dirname, '../public/meny.html')); 
    });
}