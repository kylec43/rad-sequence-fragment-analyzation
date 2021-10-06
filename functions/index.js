const functions = require("firebase-functions");
const express = require('express');
const Pages = require('./model/ejs_constants.js');
const FragmentAnalyzer = require('./model/dna_fragment_analyzer');
const FirebaseController = require('./controller/firebase_controller.js');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './view');

exports.httpReq = functions.https.onRequest(app);

app.get('/', auth, (req, res) => {
    return res.render(Pages.ROOT_PAGE, {error: false, errorMessage:"", user: req.user});
});


app.post('/results', auth, async (req, res) => {
    //input error checking
    let enzyme = req.body.enzyme;
    let genome = req.body.genome;
    let probability = req.body.probability;

    probability = parseFloat(probability);

    if(isNaN(probability) || probability < 0.01 || probability > 1.00){
        return res.render(Pages.ROOT_PAGE, {error:true, errorMessage:"Invalid Probability: Min Value=0.01, Max Value=1.00", user: req.user});
    } else {
        probability = probability.toString();
    }

    //get restriction enzyme and genome from database


    //get analyzation results
    let result = 0;    
    
    //post results
    return res.render(Pages.RESULTS_PAGE, {error:false, errorMessage:"", result: result, user: req.user});
});


app.get('/login', authAndRedirectRoot, (req, res) => {
    return res.render(Pages.LOGIN_PAGE, {error:false, errorMessage:"", user: req.user});
});

app.post('/login', authAndRedirectRoot, (req, res) => {
    return FirebaseController.loginUser(req, res);
})





app.get('/register', authAndRedirectRoot, (req, res) => {
    return res.render(Pages.REGISTER_PAGE, {error:false, errorMessage:"", user: req.user});
});

app.post('/register', authAndRedirectRoot, (req, res) => {
    return FirebaseController.registerUser(req, res);
});




app.get('/upload', authAndRedirectLogIn, (req, res) => {
    return res.render(Pages.UPLOAD_PAGE, {error:false, errorMessage:"", user: req.user});
});

app.post('/upload', authAndRedirectLogIn, async (req, res) => {
    
    if(req.body.type === "Genome"){
        return await FirebaseController.uploadGenome(req, res);
    } else {
        return await FirebaseController.uploadRestrictionEnzyme(req, res);
    }
});


app.get('/change_email', authAndRedirectLogIn, async (req, res) => {
    return res.render(Pages.CHANGE_EMAIL_PAGE, {error:false, errorMessage: "", user: req.user});
});

app.post('/change_email', authAndRedirectLogIn, async (req, res) => {
    return await FirebaseController.changeEmail(req, res);
});


app.get('/change_password', authAndRedirectLogIn, async (req, res) => {
    return res.render(Pages.CHANGE_PASSWORD_PAGE, {error:false, errorMessage: "", user: req.user});
});

app.post('/change_password', authAndRedirectLogIn, async (req, res) => {
    return await FirebaseController.changePassword(req, res);
});


app.get('/forgot_password', auth, async (req, res) => {
    return res.render(Pages.FORGOT_PASSWORD_PAGE, {error:false, errorMessage: "", user: req.user});
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
        console.log(req.user.email);
    }    
    console.log('end');
    return next();
}


async function authAndRedirectLogIn(req, res, next)
{
    req.user = await FirebaseController.getCurrentUser();
    
    if(req.user){
        return next();
    } else {
        console.log(req.user);
        console.log('authAndLogin');
        return res.redirect('/login');
    }
}

async function authAndRedirectRoot(req, res, next){
        
    req.user = await FirebaseController.getCurrentUser();
    
    if(req.user){
        res.redirect('/');
    } else {
        return next();
    }
}