// Sertifisering LAGRE JSON

document.getElementById("myForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Forhindrer skjemadata å bli sendt på vanlig måte

    

    try {
       

        const response = await fetch("/sertifisering //lenken URL", { 
            method: "GET",
            
        });

        if (response.ok) {
            // Vis bekreftelsesmelding hvis alt gikk greit
            document.getElementById("myForm").style.display = "none";
            document.getElementById("confirmation").style.display = "block";
        } else {
            // Håndter feil hvis noe gikk galt
            throw new Error("Noe gikk galt ved sending av skjemaet. Vennligst prøv igjen senere.");
        }
    } catch (error) {
        // Vis feilmelding
        alert(error.message);
    }
});

//     fetch("til database", {
//         method: "POST",
//         body: formData
//     })
//     .then(function(response) {
//         if (response.ok) {
//             // Vis bekreftelsesmelding hvis alt gikk greit
//             document.getElementById("myForm").style.display = "none";
//             document.getElementById("confirmation").style.display = "block";
//         } else {
//             // Håndter feil hvis noe gikk galt
//             throw new Error("Noe gikk galt ved sending av skjemaet. Vennligst prøv igjen senere.");
//         }
//     })
//     .catch(function(error) {
//         // Vis feilmelding
//         alert(error.message);
//     });
// });