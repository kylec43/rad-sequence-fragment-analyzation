const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const Firebase = require('../apis/firebase');
const Pages = require('../model/ejs_constants');

router.get('/forgot_password', auth, async (req, res) => {
    return res.render(Pages.FORGOT_PASSWORD_PAGE, {error:false, errorMessage: null, user: req.user, csrfToken: req.csrfToken()});
});

router.post('/forgot_password', auth, async (req, res) => {
    return await Firebase.sendPasswordResetLink(req, res);
});

module.exports = router;