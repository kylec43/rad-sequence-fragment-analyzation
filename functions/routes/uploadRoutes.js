const express = require('express');
const router = express.Router();
const { authAndRedirectLogIn } = require('../middleware/authMiddleware');
const Pages = require('../model/ejs_constants');

router.get('/upload', authAndRedirectLogIn, async (req, res) => {
    return res.render(Pages.UPLOAD_PAGE, {error:false, errorMessage: null, user: req.user, userToken: req.token});
});

module.exports = router;