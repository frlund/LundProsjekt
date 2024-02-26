
function logout() {
        sessionStorage.removeItem('userId');
        window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {
    const greenButtons = document.querySelectorAll('.green-button');

    // Legg til klikk-lytter for hver grønn knapp
    greenButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.style.backgroundColor === 'green') {
                button.style.backgroundColor = 'white';
            } else {
                button.style.backgroundColor = 'green';
            }
        });
    });

    
    const redButtons = document.querySelectorAll('.red-button');
        redButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.style.backgroundColor === 'red') {
                button.style.backgroundColor = 'white';
            } else {
                button.style.backgroundColor = 'red';
            }
        });
    });

    const godkjentButtons = document.querySelectorAll('.green-button');
        godkjentButtons.forEach(button => {
        button.style.backgroundColor = 'white';
    });

    const ikkeGodkjentButtons = document.querySelectorAll('.red-button');
        ikkeGodkjentButtons.forEach(button => {
        button.style.backgroundColor = 'red';
    });
});
