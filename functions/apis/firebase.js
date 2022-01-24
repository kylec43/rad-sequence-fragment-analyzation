var Pages = require('../model/ejs_constants.js'); 
const FirebaseAuth = require("firebase/auth");


//initialize firebase admin
var FirebaseAdmin = require('firebase-admin');
var FirebaseStorage = require('firebase/storage');

var serviceAccount = require("../rcsa-rad-sequencing-firebase-adminsdk-odhfz-9375265fde.json");
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


async function sendPasswordResetLink(req, res) 
{
    const email = req.body.email;
    await FirebaseAuth.sendPasswordResetEmail(FirebaseAuth.getAuth(), email).then(()=>{
        return res.render(Pages.LOGIN_PAGE, {error: false, errorMessage: null, user: req.user, successMessage: "Password reset link sent!", csrfToken: req.csrfToken()});
    }).catch(e => {
        return res.render(Pages.FORGOT_PASSWORD_PAGE, {error: true, errorMessage: `${e}`, user: req.user, successMessage: null, csrfToken: req.csrfToken()});
    });
}

async function logoutUser(req, res){

    res.clearCookie("__session");
    return res.redirect('/login');
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
    registerUser,
    logoutUser,
    sendPasswordResetLink,
    getRestrictionEnzymes,
    getGenomes,
    generateToken,
    sessionLogin,
    verifySession,
    sessionLoginIdToken,
};