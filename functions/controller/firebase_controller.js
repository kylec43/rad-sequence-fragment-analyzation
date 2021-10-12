var Pages = require('../model/ejs_constants.js'); 
const FirebaseAuth = require("firebase/auth");


//initialize firebase admin
var FirebaseAdmin = require('firebase-admin');
var FirebaseFirestore = require('firebase/firestore');

var serviceAccount = require("../rcsa-rad-sequencing-firebase-adminsdk-odhfz-30e829260e.json");
FirebaseAdmin.initializeApp({
    credential: FirebaseAdmin.credential.cert(serviceAccount)
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
            req.user = await FirebaseAuth.createUserWithEmailAndPassword(FirebaseAuth.getAuth(), email, password);
            return await loginUser(req, res);
        }

    } catch (e) {
        return res.render(Pages.REGISTER_PAGE, {error: true, errorMessage: e, user: req.user});
    }

}

async function changeEmail(req, res) 
{
    const newEmail = req.body.newEmail;
    const confirmNewEmail = req.body.confirmNewEmail;

    try {

        let errorMessage = "";
        if(newEmail !== confirmNewEmail){
            error = true;
            errorMessage += "• Email and Confirmation Email do not match";
        }

        if(errorMessage.length > 0){
            throw new Error(errorMessage);
        } else {
            
            await FirebaseAuth.updateEmail(FirebaseAuth.getAuth().currentUser, newEmail);
            return res.render(Pages.CHANGE_EMAIL_SUCCESS_PAGE, {error:false, errorMessage: "", user: req.user});
        }

    } catch (e) {
        return res.render(Pages.CHANGE_EMAIL_PAGE, {error: true, errorMessage: e, user: req.user});
    }

}


async function sendPasswordResetLink(req, res) 
{
    const email = req.body.email;
    await FirebaseAuth.sendPasswordResetEmail(FirebaseAuth.getAuth(), email).then(()=>{
        return res.render(Pages.FORGOT_PASSWORD_LINK_SENT_PAGE, {error: false, errorMessage: "", user: req.user});
    }).catch(e => {
        return res.render(Pages.FORGOT_PASSWORD_PAGE, {error: true, errorMessage: e, user: req.user});
    });
}


async function changePassword(req, res) 
{
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;

    try {

        let errorMessage = "";
        if(newPassword !== confirmNewPassword){
            error = true;
            errorMessage += "• New password and New password confirmation do not match";
        }

        if(errorMessage.length > 0){
            throw new Error(errorMessage);
        } else {
            
            await FirebaseAuth.updatePassword(FirebaseAuth.getAuth().currentUser, newPassword);
            return res.render(Pages.CHANGE_PASSWORD_SUCCESS_PAGE, {error:false, errorMessage: "", user: req.user});
        }

    } catch (e) {
        return res.render(Pages.CHANGE_PASSWORD_PAGE, {error: true, errorMessage: e, user: req.user});
    }

}

async function loginUser(req, res){
    let email = req.body.email;
    let password = req.body.password;

    await FirebaseAuth.signInWithEmailAndPassword(FirebaseAuth.getAuth(), email, password)
    .then((userCredential) => {
        return res.redirect('/');
    })
    .catch((e) => {
        return res.render(Pages.LOGIN_PAGE, {error: true, errorMessage: e, user: req.user});
    });
    
}

async function logoutUser(req, res){

    await FirebaseAuth.getAuth().signOut()
    .then(() => {
        return res.redirect('/login');
    })
    .catch((e) => {
        return res.render(Pages.LOGIN_PAGE, {error: true, errorMessage: e, user: req.user});
    });
    
}

function getCurrentUser(){
    
   return FirebaseAuth.getAuth().currentUser;

}

async function userSignedIn(){
    let currentUser = FirebaseAuth.getAuth().currentUser;
    return currentUser ? true : false;
}


async function getRestrictionEnzymes(user){
    var docRef = FirebaseFirestore.doc(FirebaseFirestore.getFirestore(), 'restriction_enzymes', user.uid);
    var docSnap = await FirebaseFirestore.getDoc(docRef);
    if(docSnap.exists()){
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
}

async function getGenomes(user){
    var docRef = FirebaseFirestore.doc(FirebaseFirestore.getFirestore(), 'genomes', user.uid);
    var docSnap = await FirebaseFirestore.getDoc(docRef);
    if(docSnap.exists()){
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
}

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
    userSignedIn,
    logoutUser,
    changeEmail,
    changePassword,
    sendPasswordResetLink,
    getRestrictionEnzymes,
    getGenomes,
};