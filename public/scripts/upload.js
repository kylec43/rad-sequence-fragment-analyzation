window.onload = () => {
    FirebaseController.signIn(USER_UID);
};

/*----------------------------- Data from server -----------------------------*/
const USER_UID = $("#userUid").val();

/*----------------------------- Input Elements -----------------------------*/
const enzymeName = $("#enzyme_name");
const restrictionSite = $("#restriction_site");

/*----------------------------- Misc Elements -----------------------------*/
const radUploadBlock = $("#rad_upload_block");
const uploadButton = $('#upload_button');
const error = $('#error');
const uploadForm = $('#upload_form');


async function uploadEnzyme(){

        if (uploadForm[0].checkValidity()){
        error.addClass("display-none");
        uploadButton.addClass("display-none");
        radUploadBlock.removeClass("display-none");

        try{
            await FirebaseController.uploadRestrictionEnzyme(enzymeName.val(), restrictionSite.val());
        } catch(e) {
            error.removeClass("display-none");
            error.html(`${e}`);
        }
        console.log("done");
        uploadButton.removeClass("display-none");
        radUploadBlock.addClass("display-none");
    } else {
        uploadForm[0].reportValidity(); 
    }
}
            