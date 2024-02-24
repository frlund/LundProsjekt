
import Chalk from "chalk";
import { HTTPMethods } from "./httpConstants.mjs"
import fs from "fs/promises"

//#region  Construct for decorating output.

let COLORS = {}; // Creating a lookup tbl to avoid having to use if/else if or switch. 
COLORS[HTTPMethods.POST] = Chalk.yellow;
COLORS[HTTPMethods.PATCH] = Chalk.yellow;
COLORS[HTTPMethods.PUT] = Chalk.yellow;
COLORS[HTTPMethods.GET] = Chalk.green;
COLORS[HTTPMethods.DELETE] = Chalk.red;
COLORS.Default = Chalk.gray;

// Convenience function
// https://en.wikipedia.org/wiki/Convenience_function
const colorize = (method) => {
    if (method in COLORS) {
        return COLORS[method](method);
    }
    return COLORS.Default(method);
};

//#endregion


class SuperLogger {

    // These are arbetrary values to make it possible for us to sort our logg messages. 
    static LOGGING_LEVELS = {
        ALL: 0,         // We output everything, no limits
        VERBOSE: 5,     // We output a lott, but not 
        NORMAL: 10,     // We output a moderate amount of messages
        IMPORTANT: 100, // We output just siginfican messages
        CRITICAL: 999   // We output only errors. 
    };

    #globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
    #loggers;

    //#region Using a variation on the singelton pattern
    // https://javascriptpatterns.vercel.app/patterns/design-patterns/singleton-pattern
    // This field is static 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static
    static instance = null;

    constructor() {
        // This constructor will allways return a refrence to the first instance created. 
        if (SuperLogger.instance == null) {
            SuperLogger.instance = this;
            this.#loggers = [];
            this.#globalThreshold = SuperLogger.LOGGING_LEVELS.NORMAL;
        }
        return SuperLogger.instance;
    }
    //#endregion

    static log(msg, logLevl = SuperLogger.LOGGING_LEVELS.NORMAL) {
        let logger = new SuperLogger();
        if (logger.#globalThreshold > logLevl) {
            return;
        }
        logger.#writeToLog(msg);
    }


    // This is our automatic logger, it outputs at a "normal" level
    // It is just a convinent wrapper around the more generic createLimitedRequestLogger function
    createAutoHTTPRequestLogger() {
        return this.createLimitedHTTPRequestLogger({ threshold: SuperLogger.LOGGING_LEVELS.NORMAL });
    }

    createLimitedHTTPRequestLogger(options) {
        const threshold = options.threshold || SuperLogger.LOGGING_LEVELS.NORMAL;
        return (req, res, next) => {
            if (this.#globalThreshold > threshold) {
                return;
            }          
            this.#LogHTTPRequest(req, res, next);
        }

    }

    #LogHTTPRequest(req, res, next) {
        let type = req.method;
        const path = req.originalUrl;
        const when = new Date().toLocaleTimeString();
        type = colorize(type);
        const logMessage = `${when} | ${type} | ${path} | IP: ${req.ip} | Status: ${res.statusCode}`;
        this.#writeToLog(logMessage);
        next();
    }

   async #writeToLog(msg) {
        msg += "\n";
        console.log(msg);
        const currentDate = new Date().toISOString().split('T')[0];
        const logDir = './logs';
        const logFileName = `${logDir}/log_${currentDate}.txt`;
       
        try {
            await fs.appendFile(logFileName, msg, { encoding: "utf8" });
        } catch (error) {
            console.error("Error writing to log file:", error);
        }
   }
}


export default SuperLogger