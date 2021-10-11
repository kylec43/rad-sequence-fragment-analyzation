import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

window.test = async function test(){
    console.log("TTESSTT");
}

window.signIn = async function signIn(form){

    try{
        console.log("signing in");
        await signInWithEmailAndPassword(getAuth(), document.getElementById('email').value, document.getElementById('password').value);
        console.log("Sign in success!");
        form.submit();
    } catch(e) {
        console.log(`Sign in fail! ${e}`);
        return false;
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