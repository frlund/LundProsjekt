
// The point of this class is increasing readability and maintainability of the rest of the code. 
// It should be extended and refactord as needed.

class HttpCodes {

    static SuccesfullRespons = {
        Ok: 200 // Suksess, alt bare bra
    }

    static ClientSideErrorRespons = {
        BadRequest: 400,        // Feil ved anmoding/forespørsel
        Unauthorized: 401,      // Uautorisert
        PaymentRequired: 402,   // Betaling påkrevd
        Forbidden: 403,         // Ikke tilstrekkelige tillatelser
        NotFound: 404,          // Ressurs ikke funnet
        MethodNotAllowed: 405,  // Metode er ikke tillatt
        NotAcceptable: 406      // Uakseptabelt
    }

    static ServerSideErrorResponse = {
        InternalServerError: 500,   // SERVER - Intern tjenerfeil
        NotImplemented: 501,        // SERVER - Ikke implementert/støttet
        BadGateway: 502,            // SERVER - Feil på proxy
        ServiceUnavailable: 503,    // SERVER - Utilgjengelig tjeneste
        GatewayTimeout: 504,        // SERVER - Tidsavbrudd proxy
        HTTPVersionNotSupported: 505// SERVER - Ukjent HTTP-versjon, støttes ikke
    }

}

export default HttpCodes;