const express = require('express');
const router = express.Router();
const { authAndRedirectLogIn } = require('../middleware/authMiddleware');
const Pages = require('../model/ejs_constants');

router.get('/change_password', authAndRedirectLogIn, async (req, res) => {
    return res.render(Pages.CHANGE_PASSWORD_PAGE, {errorMessage: null, user: req.user, successMessage: null, csrfToken: req.csrfToken()});
});

module.exports = router;