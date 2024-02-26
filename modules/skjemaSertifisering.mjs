class skjemaSertifisering {
    constructor(formData) {
        this.id = formData.id; 
        this.userId = formData.userId;
        this.bigardnummer = formData.bigardnummer;
        this.lokasjon = formData.lokasjon;
        this.dato = formData.dato;
        this.kontroll = formData.kontroll;
        this.skjema = formData.skjema;
        this.yngelrate_lukket = formData.yngelrate_lukket;
        this.yngelrate_apen = formData.yngelrate_apen;
        this.steinyngel = formData.steinyngel;
        this.kubebille = formData.kubebille;
        this.varroa = formData.varroa;
        this.trakemidd = formData.trakemidd;
        this.notater = formData.notater;
        
    }
}

export default skjemaSertifisering;