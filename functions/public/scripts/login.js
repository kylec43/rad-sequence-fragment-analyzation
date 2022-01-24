window.onload = () => {
    if (errorMessage.val() !== "") {
        alert(errorMessage.val());
    }

    if(successMessage.val() !== "") {
        alert(successMessage.val());
    }
    sessionLoginButton.on("click", () => {
        console.log("YEP");
        sessionLogin(email.val(), password.val(), '/');
    });

}


/*----------------------------- Input HTML Elements -----------------------------*/
const email = $("#email");
const password = $("#password");

/*----------------------------- Misc HTML Elements -----------------------------*/
const successMessage = $("#successMessage");
const errorMessage = $("#errorMessage");
const sessionLoginButton = $("#sessionLoginButton");
