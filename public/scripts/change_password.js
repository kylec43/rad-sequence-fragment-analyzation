window.onload = () => {
    changePasswordButton.on("click", () => {
        changePassword(currentPassword.val(), newPassword.val(), confirmNewPassword.val(), userEmail);
    });
}

/*----------------------------- Data from server -----------------------------*/
const userEmail = $("#userEmail").val();


/*----------------------------- Input HTML Elements -----------------------------*/
const currentPassword = $("#currentPassword");
const newPassword = $("#newPassword");
const confirmNewPassword = $("#confirmNewPassword");


/*----------------------------- Misc HTML Elements -----------------------------*/
const changePasswordButton = $("#changePasswordButton");
