var Pages = require('./ejsConstants.js'); 


//initialize firebase admin
var admin = require('firebase-admin');

var serviceAccount = require("./rcsa-rad-sequencing-firebase-adminsdk-odhfz-30e829260e.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
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
const getAuth = require("firebase/auth").getAuth;
const onAuthStateChanged = require("firebase/auth").onAuthStateChanged;
const signInWithEmailAndPassword = require('firebase/auth').signInWithEmailAndPassword;
const signOut = require('firebase/auth').signOut;

async function registerUser(req, res) 
{
    const email = req.body.email;
    const confirmEmail = req.body.confirmEmail;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;


    try {
        let errorMessage = "";
        if(email !== confirmEmail){
            error = true;
            errorMessage += "• Email and Confirmation Email do not match";
        }
        if(password !== confirmPassword){
            errorMessage += errorMessage.length > 0 ? "\n" : "";
            errorMessage += "• Password and Confirmation Password do not match"
        }

        if(errorMessage.length > 0){
            throw new Error(errorMessage);
        } else {
            
            req.user = await admin.auth().createUser({email, password});
            return res.redirect('/');
        }

    } catch (e) {
        return res.render(Pages.REGISTER_PAGE, {error: true, errorMessage: e, user: req.user});
    }

}

async function loginUser(req, res){
    let email = req.body.email;
    let password = req.body.password;

    const auth = getAuth();

    console.log(`email ${email} password ${password}`);
    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        return res.redirect('/');
    })
    .catch((e) => {
        return res.render(Pages.LOGIN_PAGE, {error: true, errorMessage: e, user: req.user});
    });
    
}

async function logoutUser(req, res){

    const auth = getAuth();

    await signOut(auth)
    .then(() => {
        return res.redirect('/login');
    })
    .catch((e) => {
        return res.render(Pages.LOGIN_PAGE, {error: true, errorMessage: e, user: req.user});
    });
    
}

async function getCurrentUser(){
    
   const auth = getAuth()
   return auth.currentUser;

}

async function userSignedIn(){
    const auth = getAuth();
    let currentUser = auth.currentUser;
    return currentUser ? true : false;
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    userSignedIn,
    logoutUser,
};