//LoggInn.mjs


const loggInButton = document.getElementById("loggInButton");
loggInButton.onclick = async function (e) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        console.log("Response Status:", response.status);

        if (response.status === 200) {
            const responseData = await response.json(); 
            const userId = responseData.user.id;

            if (userId) {
                sessionStorage.setItem('userId', userId);
                console.log("userID saved in sessionStorage:", userId);
            }
               window.location.href = "meny.html";
        } else {
            console.error("ERROR login");
            alert("ERROR Check username and password");
            
        }
    } catch (error) {
        console.error("Log error:", error);
        alert("ERROR login user!");
        
    }
}

const registerButton = document.getElementById("registerButton");
        registerButton.addEventListener("click", function() {
            window.location.href = "index.html";
});


document.addEventListener("DOMContentLoaded", function () {
    const loggInButton = document.getElementById("loggInButton");

    document.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            loggInButton.click();
        }
    });
});
