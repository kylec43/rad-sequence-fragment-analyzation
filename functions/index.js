const functions = require("firebase-functions");
const express = require('express');
const Pages = require('./model/ejs_constants.js');
const FragmentAnalyzer = require('./model/dna_fragment_analyzer');
const FirebaseController = require('./controller/firebase_controller.js');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './view');

exports.httpReq = functions.https.onRequest(app);

app.get('/', auth, async (req, res) => {
    //await FirebaseController.deleteDoc();
    let restriction_enzymes = [];
    let genomes = [];
    if(req.user === null){
        console.log("NULL");
    } else {
        console.log("Signed In");
        restriction_enzymes = await FirebaseController.getRestrictionEnzymes(req.user);
        genomes = await FirebaseController.getGenomes(req.user);
    }

    return res.render(Pages.HOME_PAGE, {error: false, errorMessage: null, user: req.user, restriction_enzymes, genomes, userToken: req.token});
});


app.post('/results', auth, async (req, res) => {
    //input error checking
    let enzyme = req.body.enzyme;
    let genome = req.body.genome;
    let probability = req.body.probability;

    probability = parseFloat(probability);

    if(isNaN(probability) || probability < 0.01 || probability > 1.00){
        return res.render(Pages.HOME_PAGE, {error:true, errorMessage:"Invalid Probability: Min Value=0.01, Max Value=1.00", user: req.user});
    } else {
        probability = probability.toString();
    }

    //get restriction enzyme and genome from database


    //get analyzation results
    let result = 0;    
    
    //post results
    return res.render(Pages.RESULTS_PAGE, {errorMessage: null, result: result, user: req.user});
});


app.get('/login', authAndRedirectHome, (req, res) => {
    return res.render(Pages.LOGIN_PAGE, {errorMessage: null, successMessage: null, user: req.user});
});

app.post('/login', authAndRedirectHome, async (req, res) => {
    return await FirebaseController.loginUser(req, res);
})





app.get('/register', authAndRedirectHome, (req, res) => {
    return res.render(Pages.REGISTER_PAGE, {errorMessage: null, user: req.user});
});

app.post('/register', authAndRedirectHome, async (req, res) => {
    return await FirebaseController.registerUser(req, res);
});




app.get('/upload', authAndRedirectLogIn, async (req, res) => {
    return res.render(Pages.UPLOAD_PAGE, {error:false, errorMessage: null, user: req.user, userToken: req.token});
});


app.get('/change_email', authAndRedirectLogIn, async (req, res) => {
    return res.render(Pages.CHANGE_EMAIL_PAGE, {error:false, errorMessage: null, user: req.user, successMessage: null});
});

app.post('/change_email', authAndRedirectLogIn, async (req, res) => {
    return await FirebaseController.changeEmail(req, res);
});


app.get('/change_password', authAndRedirectLogIn, async (req, res) => {
    return res.render(Pages.CHANGE_PASSWORD_PAGE, {errorMessage: null, user: req.user, successMessage: null});
});

app.post('/change_password', authAndRedirectLogIn, async (req, res) => {
    return await FirebaseController.changePassword(req, res);
});


app.get('/forgot_password', auth, async (req, res) => {
    return res.render(Pages.FORGOT_PASSWORD_PAGE, {error:false, errorMessage: null, user: req.user});
});

app.post('/forgot_password', auth, async (req, res) => {
    return await FirebaseController.sendPasswordResetLink(req, res);
});





app.get('/logout', authAndRedirectLogIn, async (req, res) => {
    return await FirebaseController.logoutUser(req, res);
});



async function auth(req, res, next)
{
    req.user = await FirebaseController.getCurrentUser();
    console.log('begin');
    if(req.user){
        req.token = await FirebaseController.generateToken(req.user);
        console.log(req.user.email);
    }    
    console.log('end');
    return next();
}


async function authAndRedirectLogIn(req, res, next)
{
    req.user = await FirebaseController.getCurrentUser();
    
    if(req.user){
        req.token = await FirebaseController.generateToken(req.user);
        return next();
    } else {
        console.log(req.user);
        console.log('authAndLogin');
        return res.redirect('/login');
    }
}

async function authAndRedirectHome(req, res, next){
        
    req.user = await FirebaseController.getCurrentUser();
    
    if(req.user){
        req.token = await FirebaseController.generateToken(req.user);
        res.redirect('/');
    } else {
        return next();
    }
}