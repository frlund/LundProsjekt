// Logg  BrukerInnlogging succsess
USER_API.use((req, res, next) => {
    // SuperLogger.log(`Login: ${req.method} ${req.originalUrl} av bruker: ${req.user.email}`, SuperLogger.LOGGING_LEVELS.CRITICAL););
    next();
});

// Logg  BrukerInnlogging ERROR
USER_API.use((err, req, res, next) => {
    SuperLogger.log(`ERROR login: ${err.message}`, SuperLogger.LOGGING_LEVELS.CRITICAL);
    res.status(403).json({ error: 'Tilgang nektet' }).end();
});
