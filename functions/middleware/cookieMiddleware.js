function cookieMiddleware(req, res, next){
    console.log("==============ALL=====================");
    res.cookie("XSRF-TOKEN", req.csrfToken());
    console.log("=========================1===========================");
    res.setHeader('Cache-Control', 'private');
    console.log("=========================2===========================");
    next();
}

module.exports = cookieMiddleware;