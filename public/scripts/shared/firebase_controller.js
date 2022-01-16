import { getAuth, signInWithCustomToken, updateEmail, signOut, updatePassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import {getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

window.sessionLogin = async (email, password, redirect = null)=>{

    var error = false;
    await signInWithEmailAndPassword(getAuth(), email, password).then(({user})=>{
        console.log("2");
        return user.getIdToken().then((idToken)=>{
            console.log("3");
            let res = fetch("/sessionLogin", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                },
                body: JSON.stringify({idToken}),
            });
            console.log(res);
            return res;
        });
    }).then(()=>{
        console.log("4");
    }).then(()=>{
        console.log("5");
        redirect ? window.location.assign(redirect) : null;
    }).catch((e)=>{
        alert("Invalid Credentials");
        console.log(`${e}`);
        error = true;
    });

    return !error;
}


window.changeEmail = async (currentEmail, newEmail, confirmNewEmail, password)=>{

    const changeEmailForm = $("#change_email_form");

    if(!changeEmailForm[0].checkValidity()){
        changeEmailForm[0].reportValidity(); 
        return;
    }
    let errorMessage = "";
    if(newEmail !== confirmNewEmail){
        error = true;
        errorMessage += "Email and Confirmation Email do not match";
    }

    if(errorMessage.length > 0){
        alert(errorMessage);
        return;
    }

    
    if(await sessionLogin(currentEmail, password)){
        var user = getAuth().currentUser;
        console.log(`User ${JSON.stringify(user)}`);

        console.log("UPDATING EMAIL");
        await updateEmail(user, newEmail).then(async ()=>{
            if(!await sessionLogin(newEmail, password)){
                throw Error("Unable to maintain session");
            }
            await signOut(getAuth());
            alert("Email Successfully Changed!");
            $("#currentEmail").val(newEmail);
        }).catch((e)=>{
            alert(`${e}`);
        });
    }

}


window.changePassword = async (currentPassword, newPassword, confirmNewPassword, email)=>{

    const changePasswordForm = $("#change_password_form");

    if(!changePasswordForm[0].checkValidity()){
        changePasswordForm[0].reportValidity();
        return;
    }
    let errorMessage = "";
    if(newPassword !== confirmNewPassword){
        errorMessage += "Password and Confirmation Password do not match";
    }

    if(errorMessage.length > 0){
        alert(errorMessage);
        return;
    }


    if(await sessionLogin(email, currentPassword)){
        var user = getAuth().currentUser;
        console.log(`User ${JSON.stringify(user)}`);
        await updatePassword(user, newPassword).then(async ()=>{
            if(!await sessionLogin(email, newPassword)){
                throw Error("Unable to maintain session");
            }
            await signOut(getAuth());
            console.log("UPDATED PASSWORD");
            alert("Password Successfully Changed!");
        }).catch((e)=>{
            alert(`${e}`);
        });
    }
}

window.FirebaseController = {

    signIn : async function(token){
        await signInWithCustomToken(getAuth(), `${token}`).then((userCredential) => {
            // Signed in
            console.log("Sign in success!");
            // ...
        })
        .catch((e) => {
            console.log(`Sign in fail! ${e}`);
            // ...
        });    
    },


    uploadRestrictionEnzyme: async function(name, restrictionSite){

        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
        var docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            let data = docSnap.data();
            data["restriction_enzymes"].push({'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`});
            await setDoc(docRef, data);
        } else {
            await setDoc(docRef, {'restriction_enzymes': [{'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`}]});
        }
    },

    updateRestrictionEnzyme: async function (){

        try{
            const DOC_NAME = $("#userUid").val();

            console.log("updating firestore");
            var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
            
            restriction_enzymes[enzymeSelect.selectedIndex].name = enzymeName.value
            restriction_enzymes[enzymeSelect.selectedIndex].restrictionSite = enzymeSite.value
    
            await setDoc(docRef, {restriction_enzymes});
            $(restriction_enzymes[enzymeSelect.selectedIndex]['id']).html(enzymeName.value);
    
            console.log("file updated")
            
        } catch(e){
            console.log(`update failed: ${e}`);
        }
    }
}