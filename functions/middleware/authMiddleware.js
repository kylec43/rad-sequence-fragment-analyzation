const Firebase = require('../apis/firebase');

async function auth(req, res, next)
{
    const sessionCookie = req.cookies.__session || "";
    req.user = await Firebase.verifySession(sessionCookie);
    console.log(`SESSION COOKIE IS ${sessionCookie}`);
    console.log(`USER IS ${JSON.stringify(req.user)}`);
    console.log('begin');
    if(req.user){
        req.token = await Firebase.generateToken(req.user);
        console.log(req.user.email);
    }    
    console.log('end');
    return next();
}


async function authAndRedirectLogIn(req, res, next)
{
    const sessionCookie = req.cookies.__session || "";
    req.user = await Firebase.verifySession(sessionCookie);
    console.log(`SESSION COOKIE IS ${sessionCookie}`);
    console.log(`USER IS ${JSON.stringify(req.user)}`);

    if(req.user){
        req.token = await Firebase.generateToken(req.user);
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
    req.user = await Firebase.verifySession(sessionCookie);
    console.log(`SESSION COOKIE IS ${sessionCookie}`);
    console.log(`USER IS ${JSON.stringify(req.user)}`);

    if(req.user){
        req.token = await Firebase.generateToken(req.user);
        res.redirect('/');
    } else {
        return next();
    }
}

module.exports = {
    auth,
    authAndRedirectHome,
    authAndRedirectLogIn
}