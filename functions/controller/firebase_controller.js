var Pages = require('../model/ejs_constants.js'); 
const FirebaseAuth = require("firebase/auth");


//initialize firebase admin
var FirebaseAdmin = require('firebase-admin');
var FirebaseFirestore = require('firebase/firestore');
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


async function registerUser(req, res) 
{
    
    const email = req.body.email;
    const confirmEmail = req.body.confirmEmail;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    let errorMessage = "";
    try {
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
            return res.render(Pages.REGISTER_PAGE, {errorMessage, user: req.user});
        } else {
            await FirebaseAuth.createUserWithEmailAndPassword(FirebaseAuth.getAuth(), email, password);
            await FirebaseAuth.signOut(FirebaseAuth.getAuth());
            return res.render(Pages.LOGIN_PAGE, {errorMessage: null, successMessage: "Registration Successful! Please Sign In", user: req.user})
        }

    } catch (e) {
        return res.render(Pages.REGISTER_PAGE, {errorMessage: `${e}`, user: req.user});
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
            errorMessage += "Email and Confirmation Email do not match";
        }

        if(errorMessage.length > 0){
            return res.render(Pages.CHANGE_EMAIL_PAGE, {errorMessage, user: req.user, successMessage: null});
        } else {
            
            await FirebaseAuth.updateEmail(FirebaseAuth.getAuth().currentUser, newEmail);
            return res.render(Pages.CHANGE_EMAIL_PAGE, {error:false, errorMessage: null, user: req.user, successMessage: "Email successfully changed!"});
        }

    } catch (e) {
        return res.render(Pages.CHANGE_EMAIL_PAGE, {errorMessage: `${e}`, user: req.user, successMessage: null});
    }

}


async function sendPasswordResetLink(req, res) 
{
    const email = req.body.email;
    await FirebaseAuth.sendPasswordResetEmail(FirebaseAuth.getAuth(), email).then(()=>{
        return res.render(Pages.LOGIN_PAGE, {error: false, errorMessage: null, user: req.user, successMessage: "Password reset link sent!"});
    }).catch(e => {
        return res.render(Pages.FORGOT_PASSWORD_PAGE, {error: true, errorMessage: `${e}`, user: req.user, successMessage: null});
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
            errorMessage += "New password and New password confirmation do not match";
        }

        if(errorMessage.length > 0){
            return res.render(Pages.CHANGE_PASSWORD_PAGE, {errorMessage, user: req.user, successMessage: null});
        } else {
            
            await FirebaseAuth.updatePassword(FirebaseAuth.getAuth().currentUser, newPassword);
            return res.render(Pages.CHANGE_PASSWORD_PAGE, {errorMessage: null, user: req.user, successMessage: "Password successfully changed!"});
        }

    } catch (e) {
        return res.render(Pages.CHANGE_PASSWORD_PAGE, {errorMessage: `${e}`, user: req.user, successMessage: null});
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
        return res.render(Pages.LOGIN_PAGE, {errorMessage: `${e}`, user: req.user, successMessage: null});
    });
    
}

async function logoutUser(req, res){

    await FirebaseAuth.getAuth().signOut()
    .then(() => {
        return res.redirect('/login');
    })
    .catch((e) => {
        return res.render(Pages.LOGIN_PAGE, {errorMessage: `${e}`, user: req.user, successMessage: null});
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

    try {
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

    } catch(e) {
        console.log(`Error getting enzymes ${e}`);
    }

    return [];
}

async function getGenomes(user){

    try {
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
        const q = FirebaseFirestore.query(FirebaseFirestore.collection(FirebaseFirestore.getFirestore(), "genomes_text_data"), FirebaseFirestore.where("index", "==", i));
        const querySnapshot = await FirebaseFirestore.getDocs(q);
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
  

module.exports = {
    deleteDoc,
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
    generateV4UploadSignedUrl,
    generateToken,
};