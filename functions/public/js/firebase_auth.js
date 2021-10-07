import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

async function signIn(email, password){
    try{
        await signInWithEmailAndPassword(getAuth(), email, password);
        console.log("Sign in success!");
    } catch(e) {
        console.log(`Sign in fail! ${e}`);
    }
}


async function signout(){
    await signOut(getAuth()).then(()=>{
        console.log("Signed out!")
    }).catch((e) => {
        console.log(`Error Signing Out! ${e}`);
    });

}