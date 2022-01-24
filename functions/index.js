const functions = require("firebase-functions");
const express = require('express');
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');

/* Middleware */
const cookieMiddleware = require('./middleware/cookieMiddleware');
const csrfMiddleware = csrf({cookie: true});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(cookieMiddleware);
app.use(express.static("public"));


/* Routes */
const authRoutes = require('./routes/authRoutes');
const changeEmailRoutes = require('./routes/changeEmailRoutes');
const changePasswordRoutes = require('./routes/changePasswordRoutes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const homeRoutes = require('./routes/homeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

app.use(authRoutes);
app.use(changeEmailRoutes);
app.use(changePasswordRoutes);
app.use(forgotPasswordRoutes);
app.use(homeRoutes);
app.use(uploadRoutes);


exports.httpReq = functions.https.onRequest(app);
