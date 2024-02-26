

// Sertifisering LAGRE JSON
const userId = sessionStorage.getItem('userId');
console.log("Hentet brukerens ID fra sessionStorage:", userId);
if (!userId || userId === 'undefined') {
    window.location.href = "loggInn.html";
} else {
    console.log("UserId autentisert sessionStorage.");
}

const userIdInput = document.getElementById('userId');
if (userIdInput) {
    userIdInput.value = userId;
} else {
    console.error("Elementet med ID 'userId' eksisterer ikke.");
}

document.getElementById("myForm").addEventListener("submit", async function(event) {
    event.preventDefault();   

    // Konverter FormData til JSON
    function formDataToJson(formData) {
        const json = {};
        for (const [key, value] of formData.entries()) {
            json[key] = value;
        }
        return json;
    }
    const formData = new FormData(this);
    const jsonData = formDataToJson(formData);    

    jsonData.userId = userId;

    try {
        const response = await fetch("/saveForm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonData)
        });

        if (response.ok) {
            alert("Skjemadata er lagret.");
            document.getElementById("myForm").style.display = "none";
            document.getElementById("confirmation").style.display = "block";
        } else {
            throw new Error("Noe gikk galt ved sending av skjemaet.");
        }
    } catch (error) {
        alert(error.message);
    }
});