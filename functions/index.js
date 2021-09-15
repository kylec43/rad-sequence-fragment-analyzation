const functions = require("firebase-functions");
const express = require('express');
const Pages = require('./ejsConstants.js');
const {PythonShell} = require('python-shell')
const app = express();
app.set('view engine', 'ejs');
app.set('views', './ejsviews');

exports.httpReq = functions.https.onRequest(app);


app.get('/', (req, res) => {

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


    //call python script and perform fragment analysis of genome using the specified restriction enzyme 


    //get results
    var result = "";

    let options = {
        mode: 'text',
        args: [genome, enzyme, probability]
    };

    const message = await new Promise((resolve, reject) => {
        PythonShell.run('RadSeq.py', options,(err, results) => {
          if (err) return reject(err);
          return resolve(results);
        });
      });
      result = message
    
    //post results
    console.log(`TEST: ${result}`);
    return res.render(Pages.RESULTS_PAGE, {error:false, errorMessage:"", result: result});
});


app.get('/login', (req, res) => {
    return res.render(Pages.LOGIN_PAGE, {error:false, errorMessage:""});
});

app.post('/admin', (req, res) => {
    //check password

    //if wrong, deny access

    //if right, grant access
    return res.render(Pages.ADMIN_PAGE, {error:false, errorMessage: ""});
})