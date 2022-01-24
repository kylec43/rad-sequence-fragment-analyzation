const express = require('express');
const router = express.Router();
const { authAndRedirectHome, authAndRedirectLogIn } = require('../middleware/authMiddleware');
const Firebase = require('../apis/firebase');
const Pages = require('../model/ejs_constants');

router.get('/login', authAndRedirectHome, (req, res) => {
    //return res.send("<h1>Page Disabled</h1>")
    return res.render(Pages.LOGIN_PAGE, {errorMessage: null, successMessage: null, user: req.user, csrfToken: req.csrfToken()});
});

router.get('/register', authAndRedirectHome, (req, res) => {
    return res.render(Pages.REGISTER_PAGE, {errorMessage: null, user: req.user, csrfToken: req.csrfToken()});
});

router.post('/register', authAndRedirectHome, async (req, res) => {
    return await Firebase.registerUser(req, res);
});

router.post("/sessionLogin", (req, res)=>{
    return Firebase.sessionLogin(req, res);
});

router.get('/logout', authAndRedirectLogIn, async (req, res) => {
    return await Firebase.logoutUser(req, res);
});

module.exports = router;