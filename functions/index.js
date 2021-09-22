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
    console.log(req.user);
    return res.render(Pages.ROOT_PAGE, {error: false, errorMessage:""});
});


app.post('/results', async (req, res) => {
    //input error checking
    let enzyme = req.body.enzyme;
    let genome = req.body.genome;
    let probability = req.body.probability;

    probability = parseFloat(probability);

    if(isNaN(probability) || probability < 0.01 || probability > 1.00){
        return res.render(Pages.ROOT_PAGE, {error:true, errorMessage:"Invalid Probability: Min Value=0.01, Max Value=1.00"});
    } else {
        probability = probability.toString();
    }

    //get restriction enzyme and genome from database


    //get analyzation results
    let result = RadSeqAnalyzation(genome, enzyme, probability);
    
    
    //post results
    return res.render(Pages.RESULTS_PAGE, {error:false, errorMessage:"", result: result});
});


app.get('/login', (req, res) => {
    return res.render(Pages.LOGIN_PAGE, {error:false, errorMessage:""});
});

app.post('/login', (req, res) => {
    //check password

    //if wrong, deny access

    //if right, grant access
    return adminUtil.loginUser(req, res);
})





app.get('/register', (req, res) => {
    return res.render(Pages.REGISTER_PAGE, {error:false, errorMessage:""});
});

app.post('/register', (req, res) => {
    return adminUtil.registerUser(req, res);
});




app.get('/upload', (req, res) => {
    return res.render(Pages.LOGIN_PAGE, {error:false, errorMessage:""});
});

app.post('/upload', (req, res) => {
    //check password

    //if wrong, deny access

    //if right, grant access
    return res.render(Pages.ADMIN_PAGE, {error:false, errorMessage: ""});
});



async function auth(req, res, next)
{

    req.user = adminUtil.getCurrentUser();
    return next();
}