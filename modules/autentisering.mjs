// MIDDLEWARE for tilgangskontroll
import DBManager from './storageManager.mjs';

async function checkAuthentic(req, res, next) {
    let userId;
    if(req.session && req.session.userId) {
        userId = req.session.userId;
    } else {
        userId = undefined;
    }

    if (userId) {
        try {
            const user = await DBManager.getUser(userId);
            if (user) {
                console.log('Bruker autentisert.');
                return next();
            }
        } catch (error) {
            console.error('Feil ved autentisering:', error);
        }
    }

    return res.redirect('/index.html');
}

export default checkAuthentic;
