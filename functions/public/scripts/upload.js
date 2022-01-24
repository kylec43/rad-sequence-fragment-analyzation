window.onload = () => {
    signIn(USER_TOKEN);
    enzymeUploadButton.on("click", uploadEnzyme);
};

/*----------------------------- Data from server -----------------------------*/
const USER_TOKEN = $("#userToken").val();

/*----------------------------- Input Elements -----------------------------*/
const enzymeName = $("#enzyme_name");
const restrictionSite = $("#restriction_site");

/*----------------------------- Misc Elements -----------------------------*/
const radUploadBlock = $("#rad_upload_block");
const enzymeUploadButton = $('#enzymeUploadButton');
const error = $('#error');
const uploadForm = $('#upload_form');


async function uploadEnzyme(){

        if (uploadForm[0].checkValidity()){
        error.addClass("display-none");
        enzymeUploadButton.addClass("display-none");
        radUploadBlock.removeClass("display-none");

        try{
            await uploadRestrictionEnzyme(enzymeName.val(), restrictionSite.val());
        } catch(e) {
            error.removeClass("display-none");
            error.html(`${e}`);
        }
        console.log("done");
        enzymeUploadButton.removeClass("display-none");
        radUploadBlock.addClass("display-none");
    } else {
        uploadForm[0].reportValidity(); 
    }
}
            