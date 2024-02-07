// Middleware, sjekk userId


function isAuthenticated(req, res, next) {
    console.log('Sjekk autentisering...');

    if (req.session && req.session.userId) {
        console.log('Bruker er autentisert.');
        return next();
    } else {
        console.log('Ikke autorisert');
        return res.redirect('../public/index.html'); 
    }
}

export default function(okLogin) {
    okLogin.get('../public/meny.html', isAuthenticated, (req, res) => {
        console.log('Bruker autentisert.');
        res.sendFile('../public/meny.html'); 
    });
}