import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

window.signIn = async function signIn(email, password){

    try{
        authError.innerHTML = "";
        authError.style.display = "none";
        console.log("signing in");
        await signInWithEmailAndPassword(getAuth(), email, password);
        console.log("Sign in success!");
    } catch(e) {
        console.log(`Sign in fail! ${e}`);
        authError.style.display = "block";
        authError.innerHTML = `${e}`;
        throw e;
    }
}



window.signOut = async function signout(){
    await signOut(getAuth()).then(()=>{
        console.log("Signed out!")
        return true;
    }).catch((e) => {
        console.log(`Error Signing Out! ${e}`);
        return false;
    });

}