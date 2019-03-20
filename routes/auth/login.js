var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/', function(req, res) {
    res.render('pages/auth/login', { success: false, error: req.session.errors });
    req.session.errors = null;
});

router.post('/', function(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password is invalid').isLength({ min: 6 });

    var errors = req.validationErrors();
    if (errors) {
        for(var i =0; i < errors.length; i++){
            if(errors[i].param == "password"){
                req.flash("error_msg" , "Password Length must be greater than 5 characters")
            }else{
                req.flash("error_msg" , "Email Address must be a valid email address")
            }
        }
        res.redirect('/auth/login');
    } else {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function(firebaseUser) {
                req.flash('success_msg', 'Logged In');
                req.session.success = true;
                req.session.uid = firebaseUser.user.uid;
                req.session.username = firebaseUser.user.email;

                res.locals.uid = req.session.uid;
                res.locals.username = req.session.username;
                res.locals.success = req.session.success;

                res.redirect('/home');
            })
            .catch(function(error) {
                console.log(error.code)
                if(error.code == "auth/wrong-password"){
                    req.flash("error_msg" , "Incorrect Password");
                    res.redirect('/auth/login');
                }else{
                    req.flash("error_msg" , "Invalid Login Attempt");
                    res.redirect('/auth/login');
                }
            });
    }

});

module.exports = router;