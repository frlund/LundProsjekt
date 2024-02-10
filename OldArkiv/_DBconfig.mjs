// DBconfig.mjs

const databaseConfig = {
    host: 'localhost', 
    port: 5432, 
    user: 'postgres', 
    password: 'Kaffekopp', //NB! Bør ikke stå i klartekst når man går live!
    database: 'sertifisering' 
};

export default databaseConfig;