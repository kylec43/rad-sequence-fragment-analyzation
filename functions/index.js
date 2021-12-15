const functions = require("firebase-functions");
const express = require('express');
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const Pages = require('./model/ejs_constants.js');
const FragmentAnalyzer = require('./model/dna_fragment_analyzer');
const FirebaseController = require('./controller/firebase_controller.js');
const cors = require('cors')({origin: true});



const csrfMiddleware = csrf({cookie: true});

const app = express();
app.use(cors);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(csrfMiddleware);


app.set('view engine', 'ejs');
app.set('views', './view');

app.all("*", (req, res, next) => {
    console.log("==============ALL=====================");
    res.cookie("XSRF-TOKEN", req.csrfToken());
    console.log("=========================1===========================");
    res.setHeader('Cache-Control', 'private');
    console.log("=========================2===========================");
    next();
});

exports.httpReq = functions.https.onRequest(app);

app.get('/', auth, async (req, res) => {
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
        return res.render(Pages.HOME_PAGE, {error:true, errorMessage:"Invalid Probability: Min Value=0.01, Max Value=1.00", user: req.user, userToken: req.token});
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
    //return res.send("<h1>Page Disabled</h1>")
    return res.render(Pages.LOGIN_PAGE, {errorMessage: null, successMessage: null, user: req.user});
});

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
    return res.render(Pages.CHANGE_EMAIL_PAGE, {error:false, errorMessage: null, user: req.user, successMessage: null, csrfToken: req.csrfToken()});
});

app.post('/change_email', authAndRedirectLogIn, async (req, res) => {
    console.log("=================ENTER==================");
    return await FirebaseController.changeEmail(req, res);
});


app.get('/change_password', authAndRedirectLogIn, async (req, res) => {
    return res.render(Pages.CHANGE_PASSWORD_PAGE, {errorMessage: null, user: req.user, successMessage: null, csrfToken: req.csrfToken()});
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
    const sessionCookie = req.cookies.__session || "";
    req.user = await FirebaseController.verifySession(sessionCookie);
    console.log(`SESSION COOKIE IS ${sessionCookie}`);
    console.log(`USER IS ${JSON.stringify(req.user)}`);
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
    const sessionCookie = req.cookies.__session || "";
    req.user = await FirebaseController.verifySession(sessionCookie);
    console.log(`SESSION COOKIE IS ${sessionCookie}`);
    console.log(`USER IS ${JSON.stringify(req.user)}`);

    if(req.user){
        req.token = await FirebaseController.generateToken(req.user);
        console.log("================NEXT=================");
        return next();
    } else {
        console.log(req.user);
        console.log('authAndLogin');
        return res.redirect('/login');
    }
}

async function authAndRedirectHome(req, res, next){
        
    const sessionCookie = req.cookies.__session || "";
    req.user = await FirebaseController.verifySession(sessionCookie);
    console.log(`SESSION COOKIE IS ${sessionCookie}`);
    console.log(`USER IS ${JSON.stringify(req.user)}`);

    if(req.user){
        req.token = await FirebaseController.generateToken(req.user);
        res.redirect('/');
    } else {
        return next();
    }
}

app.post("/sessionLogin", (req, res)=>{
    return FirebaseController.sessionLogin(req, res);
});
