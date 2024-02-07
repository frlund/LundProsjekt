//Kan være denne filen burde ha .mjs filending istedenfor. Google "mjs js difference"
//Sjekk ut postman(extension i vscode), evnt. swagger(tester API i nettleseren)
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "sertifisering",
    password: "Kaffekopp",
    port: "5432"
});

module.exports = pool;