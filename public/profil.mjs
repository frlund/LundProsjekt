document.addEventListener('DOMContentLoaded', function() {
    getUser(1);
});

async function getUser(userId) {
        const response = await fetch('/user/' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response);
        // document.getElementById('email').value(response.user.email);
}

