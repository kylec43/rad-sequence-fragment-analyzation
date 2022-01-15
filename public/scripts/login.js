window.onload = () => {

    if (errorMessage.val() !== null) {
        alert(errorMessage.val());
    }

    if(successMessage.val() !== "") {
        alert(successMessage.val());
    }
    loginButton.on("click", () => {
        sessionLogin(email.val(), password.val(), '/');
    });
}


/*----------------------------- Input HTML Elements -----------------------------*/
const emailInput = $("#email");
const passwordInput = $("#password");

/*----------------------------- Misc HTML Elements -----------------------------*/
const successMessage = $("#successMessage");
const errorMessage = $("#errorMessage");
const loginButton = $("#loginButton");
