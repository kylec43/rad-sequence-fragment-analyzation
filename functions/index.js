const functions = require("firebase-functions");
const express = require('express');
const app = express();

exports.httpReq = functions.https.onRequest(app);

app.get('/home', (req, res) => {
    console.log('test');
    res.send('<html><h1>test</h1></html>');
});

console.log('test2');