var Pages = require('../model/ejs_constants.js'); 
const FirebaseAuth = require("firebase/auth");


//initialize firebase admin
var FirebaseAdmin = require('firebase-admin');
var FirebaseStorage = require('firebase/storage');

var serviceAccount = require("../rcsa-rad-sequencing-firebase-adminsdk-odhfz-30e829260e.json");
FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert(serviceAccount),
    storageBucket: "rcsa-rad-sequencing.appspot.com",
});

//initialize firebase app
const initializeApp = require("firebase/app").initializeApp;

const firebaseConfig = {
    apiKey: "AIzaSyBF_dfisH-WtNUO4CVMJTEtPqE4FoITrog",
    authDomain: "rcsa-rad-sequencing.firebaseapp.com",
    projectId: "rcsa-rad-sequencing",
    storageBucket: "rcsa-rad-sequencing.appspot.com",
    messagingSenderId: "882666194084",
    appId: "1:882666194084:web:51cfa1dcae998ef47c9231",
    measurementId: "G-C33DL3DE4M"
};

const app = initializeApp(firebaseConfig);
var FirebaseFirestore = FirebaseAdmin.firestore();



async function registerUser(req, res) 
{
    
    const email = req.body.email;
    const confirmEmail = req.body.confirmEmail;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    let errorMessage = "";
    if(email !== confirmEmail){
        error = true;
        errorMessage += "Email and Confirmation Email do not match";
    }
    if(password !== confirmPassword){
        errorMessage += errorMessage.length > 0 ? "<br>" : "";
        errorMessage += "Password and Confirmation Password do not match"
    } else if (password.length < 6) {
        errorMessage += errorMessage.length > 0 ? "<br>" : "";
        errorMessage += "Password length is too short. 6 characters minimum";
    }

    if(errorMessage.length > 0){
        return res.render(Pages.REGISTER_PAGE, {errorMessage, user: req.user, csrfToken: req.csrfToken()});
    } else {
        await FirebaseAdmin.auth().createUser({
            email,
            password,
        }).then(()=>{
            return res.render(Pages.LOGIN_PAGE, {errorMessage: null, successMessage: "Registration Successful! Please Sign In", user: req.user, csrfToken: req.csrfToken()});
        }).catch((e)=>{
            return res.render(Pages.REGISTER_PAGE, {errorMessage: `${e}`, user: req.user, csrfToken: req.csrfToken()});
        });
    }
}

async function changeEmail(req, res) 
{
    const newEmail = req.body.newEmail;
    const confirmNewEmail = req.body.confirmNewEmail;
    console.log("===================1===============================");
    const user = await verifySession(req.cookies.__session);
    console.log("2");


    let errorMessage = "";
    if(newEmail !== confirmNewEmail){
        error = true;
        errorMessage += "Email and Confirmation Email do not match";
    }

    if(errorMessage.length > 0){
        return res.render(Pages.CHANGE_EMAIL_PAGE, {errorMessage, user: req.user, successMessage: null});
    } else {
        await FirebaseAdmin.auth().updateUser(user.uid, {
            email: newEmail
        }).then(()=>{
            return res.render(Pages.LOGIN_PAGE, {error:false, errorMessage: null, user: req.user, successMessage: "Email successfully changed! Please Log In.", csrfToken: req.csrfToken()});
        }).catch((e)=>{
            return res.render(Pages.CHANGE_EMAIL_PAGE, {errorMessage: `${e}`, user: req.user, successMessage: null, csrfToken: req.csrfToken()});
        });
    }
}


async function sendPasswordResetLink(req, res) 
{
    const email = req.body.email;
    await FirebaseAuth.sendPasswordResetEmail(FirebaseAuth.getAuth(), email).then(()=>{
        return res.render(Pages.LOGIN_PAGE, {error: false, errorMessage: null, user: req.user, successMessage: "Password reset link sent!", csrfToken: req.csrfToken()});
    }).catch(e => {
        return res.render(Pages.FORGOT_PASSWORD_PAGE, {error: true, errorMessage: `${e}`, user: req.user, successMessage: null, csrfToken: req.csrfToken()});
    });
}


async function changePassword(req, res) 
{
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;


    let errorMessage = "";
    if(newPassword !== confirmNewPassword){
        error = true;
        errorMessage += "New password and New password confirmation do not match";
    }

    if(errorMessage.length > 0){
        return res.render(Pages.CHANGE_PASSWORD_PAGE, {errorMessage, user: req.user, successMessage: null});
    } else {
        
        FirebaseAdmin.auth().updateUser(req.user.uid, {
            password: newPassword
        }).then(()=>{
            return res.render(Pages.LOGIN_PAGE, {errorMessage: null, user: req.user, successMessage: "Password successfully changed! Please Log In.", csrfToken: req.csrfToken()});
        }).catch((e)=>{
            return res.render(Pages.CHANGE_PASSWORD_PAGE, {errorMessage: `${e}`, user: req.user, successMessage: null, csrfToken: req.csrfToken()});
        });
    }

}

async function logoutUser(req, res){

    res.clearCookie("__session");
    return res.redirect('/login');
}

function getCurrentUser(){
    
   return FirebaseAuth.getAuth().currentUser;

}

async function userSignedIn(){
    let currentUser = FirebaseAuth.getAuth().currentUser;
    return currentUser ? true : false;
}


async function getRestrictionEnzymes(user){

    try {
        console.log(user.uid);
        var docSnap = await FirebaseFirestore.collection('restriction_enzymes').doc(user.uid).get();

        console.log(JSON.stringify(docSnap));
        if(docSnap.exists){
            let enzymes = docSnap.data()["restriction_enzymes"];

            for(let i = 1; i < enzymes.length; i++){
                let j = i-1;
                let value = enzymes[i];
                while(j >= 0 && enzymes[j]["name"].toLowerCase() > value["name"].toLowerCase()){
                    enzymes[j+1] = enzymes[j];
                    j--;
                }

                enzymes[j+1] = value;
            }
            return enzymes;
        } else {
            return [];
        }

    } catch(e) {
        console.log(`Error getting enzymes ${e}`);
    }
    

    return [];
}

async function getGenomes(user){

    try {
        var docSnap = await FirebaseFirestore.collection('genomes').doc(user.uid).get();
    
        if(docSnap.data()){
            let genomes = docSnap.data()["genomes"];
            for(let i = 1; i < genomes.length; i++){
                let j = i-1;
                let value = genomes[i];
                while(j >= 0 && genomes[j]["name"].toLowerCase() > value["name"].toLowerCase()){
                    genomes[j+1] = genomes[j];
                    j--;
                }
                genomes[j+1] = value;
            }
            return genomes;
        } else {
            return [];
        }
    } catch(e) {
        console.log(`Error getting genomes ${e}`);
    }

    return [];
}


async function generateV4UploadSignedUrl(user) {

    // These options will allow temporary uploading of the file with outgoing
    // Content-Type: application/octet-stream header.
    const options = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 1500 * 60 * 1000, // 15 minutes
        contentType: 'application/octet-stream',
    };
    let filePath = `genomes/${user.uid}/${Date.now()}`;
    var [url] = await FirebaseAdmin.storage().bucket().file(`${filePath}`).getSignedUrl(options);
  
    console.log('Generated PUT signed URL:');
    console.log(url);
    console.log('You can use this URL with any user agent, for example:');
    console.log(
      "curl -X PUT -H 'Content-Type: application/octet-stream' " +
        `--upload-file my-file '${url}'`
    );

    return {signedUrl: url, filePath};
}


async function generateToken(user){
    let token = null;
    await FirebaseAdmin.auth().createCustomToken(user.uid).then((customToken) => {
                    console.log(`TOKEN CREATED! ${customToken}`);
                    token = customToken;
                })
                .catch((error) => {
                    console.log('Error creating custom token:', error);
                });
    return token;
}

async function deleteDoc(){
    try{
        
        for(let i = 0; i < 60; i++){
            const querySnapshot = await FirebaseFirestore.collection("genomes_text_data").where("index", "==", i).get();
            console.log("Got query snapshot");
            console.log(`Snapshot size is ${querySnapshot.size}`);
            querySnapshot.forEach(async (doc) => {
                try{
                await FirebaseFirestore.deleteDoc(doc.ref)
                console.log("Deleted Doc");
                } catch(e){
                    console.log(`Error ocurred: ${e}`);
                }
            });
        }
    } catch(e){
            console.log(`Error ocurred: ${e}`);
    }
}


async function sessionLogin(req, res){
    const idToken = req.body.idToken.toString();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    FirebaseAdmin
    .auth()
    .createSessionCookie(idToken, {expiresIn})
    .then(
        (sessionCookie)=>{
            console.log("SESSION LOGIN! " + sessionCookie);
            const options = {maxAge: expiresIn, httpOnly: true};
            res.cookie("__session", sessionCookie, options);
            return res.end(JSON.stringify({status: "success"}));        
        },
        (error) => {
            console.log("SESSION LOGIN FAILED!!!");
            res.status(401).send("UNAUTHORIZED ACCESS")
        }
    );
}

async function sessionLoginIdToken(req, res, idToken){
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    FirebaseAdmin
    .auth()
    .createSessionCookie(idToken, {expiresIn})
    .then(
        (sessionCookie)=>{
            console.log("SESSION LOGIN! " + sessionCookie);
            const options = {maxAge: expiresIn, httpOnly: true};
            res.cookie("__session", sessionCookie, options);
        },
        (error) => {
            console.log(`SESSION LOGIN FAILED!!! ${error}`);
        }
    );
}


async function verifySession(sessionCookie){
    let user = null;
    console.log("The session cookie is:");
    console.log(sessionCookie);
    await FirebaseAdmin
    .auth()
    .verifySessionCookie(sessionCookie, true)
    .then((decodedClaims)=>{
        console.log(`DECODED CLAIMS: ${JSON.stringify(decodedClaims)}`);
        user = decodedClaims;
    })
    .catch((e)=>{
        console.log(`The error is ${e}`);
    });

    return user
}


  

module.exports = {
    deleteDoc,
    registerUser,
    getCurrentUser,
    userSignedIn,
    logoutUser,
    changeEmail,
    changePassword,
    sendPasswordResetLink,
    getRestrictionEnzymes,
    getGenomes,
    generateV4UploadSignedUrl,
    generateToken,
    sessionLogin,
    verifySession,
    sessionLoginIdToken,
};