// nybruker.mjs

document.getElementById('registerUserButton').addEventListener('click', async function () {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name, password })
    });
    if (response.ok) {
        alert('Brukeren ble registrert!');
        // Legg til videre navigasjon eller andre handlinger etter vellykket registrering
    } else {
        alert('Feil ved registrering av bruker');
    }
});

