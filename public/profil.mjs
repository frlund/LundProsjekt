document.addEventListener('DOMContentLoaded', function() {
    getUser(5);
});

// Sende inn userid fra autentisering - session
async function getUser(userId) {
    const response = await fetch("/user/" + userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

// const deleteUserButton = document.getElementById("deleteUser");

// deleteUserButton.onclick = async function (e) {
//     const respon = await deleteUser("/user/1"); // Erstatt med user.id

// }

// async function deleteUser(url, data) {
//     const header = {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//     };

//     const respon = await fetch(url, header);
//     return respon;
// }

