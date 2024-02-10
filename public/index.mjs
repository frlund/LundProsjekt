
// index.mjs

//import isAuthenticated from './modules/autentisering.mjs'

//Brukerregistrering
document.addEventListener('DOMContentLoaded', function() {    
    document.getElementById('newUser').addEventListener('click', function () {
            document.getElementById('popupContainer').style.display = 'block';
    });

    const popupContainer = document.getElementById('popupContainer');
    const closeButton = document.getElementById('closeButton');

    closeButton.addEventListener('click', function() {
        popupContainer.style.display = 'none';
    });

    document.getElementById('registerUserButton').addEventListener('click', async function () {
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const fylke = document.getElementById('fylke').value;

        try {
            const response = await fetch('/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, fylke })
            });
    
            if (response.ok) {
                alert('Du er registrert! Velkommen');
            } else {
                alert('Noe gikk galt under registreringen');
            }
        } catch (error) {
            console.error('Feil ved registrering av bruker:', error);
            alert('Noe gikk galt under registreringen');
        }
    });
});

// INNLOGGING

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('newUser').addEventListener('click', function () {
        document.getElementById('popupContainer').style.display = 'block';
    });

    document.getElementById('loginButton').addEventListener('click', function () {
        document.getElementById('loginPopupContainer').style.display = 'block';
    });

    const popupContainer = document.getElementById('popupContainer');
    const closeButton = document.getElementById('closeButton');

    closeButton.addEventListener('click', function() {
        popupContainer.style.display = 'none';
    });

    const loginPopupContainer = document.getElementById('loginPopupContainer');
    const closeLoginButton = document.getElementById('closeLoginButton');

    closeLoginButton.addEventListener('click', function() {
        loginPopupContainer.style.display = 'none';
    });

    document.getElementById('registerUserButton').addEventListener('click', async function () {
        // Registreringskoden eller ID...?
    });

    document.getElementById('loginUserButton').addEventListener('click', async function () {
        const email = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
    
        const response = await fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        console.log('Innloggingsforespørsel status:', response.status);
    
        if (response.ok) {
            alert('Du er logget inn!');
            window.location.href = 'meny.html'; // Omdirigerer til meny.html
        } else {
            alert('Feil brukernavn eller passord');
        }
    });
});