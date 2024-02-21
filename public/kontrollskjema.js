
function logout() {
    // console.log("Log out");
        sessionStorage.removeItem('userId');
        window.location.href = 'index.html';
}

 




document.addEventListener('DOMContentLoaded', function () {
    // Finn alle celler med klasse "green-button"
    const greenButtons = document.querySelectorAll('.green-button');

    // Legg til klikk-lytter for hver grønn knapp
    greenButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Sjekk om knappen allerede er grønn
            if (button.style.backgroundColor === 'green') {
                // Hvis den allerede er grønn, endre fargen tilbake til hvit
                button.style.backgroundColor = 'white';
            } else {
                // Hvis den ikke er grønn, endre fargen til grønn
                button.style.backgroundColor = 'green';
            }
        });
    });

    // Finn alle celler med klasse "red-button"
    const redButtons = document.querySelectorAll('.red-button');

    // Legg til klikk-lytter for hver rød knapp
    redButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Sjekk om knappen allerede er rød
            if (button.style.backgroundColor === 'red') {
                // Hvis den allerede er rød, endre fargen tilbake til hvit
                button.style.backgroundColor = 'white';
            } else {
                // Hvis den ikke er rød, endre fargen til rød
                button.style.backgroundColor = 'red';
            }
        });
    });

    // Sett opp startfarger for kolonne 4 og 5
    const godkjentButtons = document.querySelectorAll('.green-button');
    godkjentButtons.forEach(button => {
        button.style.backgroundColor = 'white';
    });

    const ikkeGodkjentButtons = document.querySelectorAll('.red-button');
    ikkeGodkjentButtons.forEach(button => {
        button.style.backgroundColor = 'white';
    });
});
