// autentisering.mjs

export function requireRegistration(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Manglende e-post eller passord' });
    }
    
    next();
}

export function requireLogin(req, res, next) {
    // Sjekk om brukeren er logget inn (for eksempel ved å validere en sesjon eller JWT-token)
    // Her må du tilpasse dette basert på hvordan du implementerer innlogging
    if (!req.session.loggedIn) { 
        return res.status(401).json({ error: 'Du må være logget inn for å åpne meny.html' });
    }
    // Fortsett til neste middleware hvis brukeren er logget inn
    next();
}
