import { getAuth, signInWithCustomToken} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";

window.signIn = async function signIn(token){
    //sign in with token
    console.log("signing in");

    await signInWithCustomToken(getAuth(), `${token}`).then((userCredential) => {
        // Signed in
        console.log("Sign in success!");
        // ...
    })
    .catch((e) => {
        console.log(`Sign in fail! ${error}`);
        // ...
    });
}