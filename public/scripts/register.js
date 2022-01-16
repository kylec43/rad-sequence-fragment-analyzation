window.onload = () => {
    if (errorMessage.val() !== "") {
        alert(errorMessage.val());
    }
}


/*----------------------------- Misc HTML Elements -----------------------------*/
const errorMessage = $("#errorMessage");
