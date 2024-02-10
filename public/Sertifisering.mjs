// Sertifisering EMAIL

document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Forhindrer skjemadata å bli sendt på vanlig måte

    var formData = new FormData(this); // Henter skjemadata

    fetch("send_email.php", {
        method: "POST",
        body: formData
    })
    .then(function(response) {
        if (response.ok) {
            // Vis bekreftelsesmelding hvis alt gikk greit
            document.getElementById("myForm").style.display = "none";
            document.getElementById("confirmation").style.display = "block";
        } else {
            // Håndter feil hvis noe gikk galt
            throw new Error("Noe gikk galt ved sending av skjemaet. Vennligst prøv igjen senere.");
        }
    })
    .catch(function(error) {
        // Vis feilmelding
        alert(error.message);
    });
});