var Pages = require('./ejsConstants.js'); 


//initialize firebase admin
var admin = require('firebase-admin');

var serviceAccount = require("./rcsa-rad-sequencing-firebase-adminsdk-odhfz-30e829260e.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });


//initialize firebase
var firebase = require('./firebase');

const firebaseConfig = {
    apiKey: "AIzaSyBF_dfisH-WtNUO4CVMJTEtPqE4FoITrog",
    authDomain: "rcsa-rad-sequencing.firebaseapp.com",
    projectId: "rcsa-rad-sequencing",
    storageBucket: "rcsa-rad-sequencing.appspot.com",
    messagingSenderId: "882666194084",
    appId: "1:882666194084:web:51cfa1dcae998ef47c9231",
    measurementId: "G-C33DL3DE4M"
};

firebase.initializeApp(firebaseConfig);

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
            
            await admin.auth().createUser({email, password});
            return res.render(Pages.ROOT_PAGE, {error: false, errorMessage: ""});
        }

    } catch (e) {
        return res.render(Pages.REGISTER_PAGE, {error: true, errorMessage: e});
    }

}

async function loginUser(req, res){
    let email = req.body.email;
    let password = req.body.password;

    try {
        const userRecord = await admin.auth().signInWithEmailAndPassword(email, password);
        return res.render(Pages.ROOT_PAGE, {error: false, errorMessage: ""});
    } catch(e) {
        return res.render(Pages.LOGIN_PAGE, {error: true, errorMessage: e});
    }
}

function getCurrentUser(){
    return firebase.auth().currentUser;
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
};