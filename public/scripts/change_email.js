window.onload = () => {
    changeEmailButton.on("click", () => {
        changeEmail(currentEmail.val(), newEmail.val(), confirmNewEmail.val(), password.val())
    });
}

/*----------------------------- Data from server -----------------------------*/


/*----------------------------- Input HTML Elements -----------------------------*/
const currentEmail = $("#currentEmail");
const newEmail = $("#newEmail");
const confirmNewEmail = $("#confirmNewEmail");
const password = $("#password");

/*----------------------------- Misc HTML Elements -----------------------------*/
const changeEmailButton = $("#changeEmailButton");
