const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const Firebase = require('../apis/firebase');
const Pages = require('../model/ejs_constants');

router.get('/', auth, async (req, res) => {
    let restriction_enzymes = [];
    let genomes = [];
    if(req.user === null){
        console.log("NULL");
    } else {
        console.log("Signed In");
        restriction_enzymes = await Firebase.getRestrictionEnzymes(req.user);
        genomes = await Firebase.getGenomes(req.user);
    }

    return res.render(Pages.HOME_PAGE, {error: false, errorMessage: null, user: req.user, restriction_enzymes, genomes, userToken: req.token});

});

module.exports = router;