window.onload = () => {
    if (errorMessage.val() !== null) {
        alert(errorMessage.val());
    }
}


/*----------------------------- Misc HTML Elements -----------------------------*/
const errorMessage = $("#errorMessage");