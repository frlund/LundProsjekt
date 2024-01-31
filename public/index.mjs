document.addEventListener('DOMContentLoaded', function() {
    // Lytter etter klikk på "Registrer ny bruker" knappen
    document.getElementById('registerButton').addEventListener('click', function () {
        // Viser registreringsskjemaet
        document.getElementById('registerBox').style.display = 'block';
    });

    // Lytter etter klikk på "Registrer!" knappen inne i registreringsskjemaet
    document.getElementById('registerUserButton').addEventListener('click', async function () {
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;

        // Sender en POST-forespørsel med brukerdata til serveren
        const response = await fetch('/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, name, password })
        });

        if (response.ok) {
            // Viser en bekreftelsesmelding ved vellykket registrering
            alert('Du er registrert! Velkommen');
            // Legg til videre navigasjon eller andre handlinger etter vellykket registrering
        } else {
            // Viser en feilmelding hvis registreringen mislykkes
            alert('Feil ved registrering av bruker');
        }
    });
});