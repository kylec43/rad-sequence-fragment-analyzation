const functions = require("firebase-functions");
const express = require('express');
const Pages = require('./ejsConstants.js');
const RadSeqAnalyzation = require('./radseq.js').RadSeqAnalyzation;
const adminUtil = require('./adminUtil.js');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './ejsviews');

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
    let result = RadSeqAnalyzation(genome, enzyme, probability);
    
    
    //post results
    return res.render(Pages.RESULTS_PAGE, {error:false, errorMessage:"", result: result, user: req.user});
});


app.get('/login', authAndRedirectRoot, (req, res) => {
    return res.render(Pages.LOGIN_PAGE, {error:false, errorMessage:"", user: req.user});
});

app.post('/login', authAndRedirectRoot, (req, res) => {
    return adminUtil.loginUser(req, res);
})





app.get('/register', authAndRedirectRoot, (req, res) => {
    return res.render(Pages.REGISTER_PAGE, {error:false, errorMessage:"", user: req.user});
});

app.post('/register', authAndRedirectRoot, (req, res) => {
    return adminUtil.registerUser(req, res);
});




app.get('/upload', authAndRedirectLogIn, (req, res) => {
    return res.render(Pages.UPLOAD_PAGE, {error:false, errorMessage:"", user: req.user});
});

app.post('/upload', authAndRedirectLogIn, (req, res) => {
    //check password

    //if wrong, deny access

    //if right, grant access
    return res.render(Pages.UPLOAD_PAGE, {error:false, errorMessage: "", user: req.user});
});


app.get('/logout', auth, async (req, res) => {
    return await adminUtil.logoutUser(req, res);
});



async function auth(req, res, next)
{
    req.user = await adminUtil.getCurrentUser();
    console.log('begin');
    if(req.user){
        console.log(req.user.email);
    }    
    console.log('end');
    return next();
}


async function authAndRedirectLogIn(req, res, next)
{
    req.user = await adminUtil.getCurrentUser();
    
    if(req.user){
        return next();
    } else {
        console.log(req.user);
        console.log('authAndLogin');
        return res.redirect('/login');
    }
}

async function authAndRedirectRoot(req, res, next){
        
    req.user = await adminUtil.getCurrentUser();
    
    if(req.user){
        res.redirect('/');
    } else {
        return next();
    }
}