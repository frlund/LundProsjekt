// MIDDLEWARE for tilgangskontroll
import DBManager from './storageManager.mjs';

async function checkAuthentic(req, res, next) {
    console.log('Sjekk autentisering...');
    const userId = req.session && req.session.userId;

    if (userId) {
        try {
            const user = await DBManager.getUser(userId);
            if (user) {
                console.log('Bruker er autentisert.');
                return next();
            }
        } catch (error) {
            console.error('Feil ved autentisering:', error);
        }
    }

    console.log('Ikke autorisert');
    return res.redirect('/index.html');
}

export default checkAuthentic;
