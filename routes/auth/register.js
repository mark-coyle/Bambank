var express = require('express');
var router = express.Router();
var firebase = require('firebase');

router.get('/', function(req, res) {
    res.render('pages/auth/register', { success: false, error: req.session.errors });
    req.session.errors = null;
});

router.post('/', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    req.check('email', 'Invalid email address').isEmail();
    req.check('password', 'Password is invalid').isLength({ min: 6 });

    var errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
    } else {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function(firebaseUser) {
                var userData = {
                    "firstName": firstName,
                    "lastName": lastName,
                    "email": email,
                    "balance": 100
                }
                let name = firstName +" "+ lastName;
                let uid = firebaseUser.user.uid;

                let accountData = {
                    "Name":name
                }

                firebase.database().ref('users')
                .child(uid).set(userData);

                firebase.database().ref('accounts').child(uid).set(accountData);

                req.flash('success_msg', 'Logged In');

                req.session.success = true;
                req.session.uid = uid;
                req.session.username = firebaseUser.user.email;
                res.redirect('/home');
            })
            .catch(function(error) {
                console.log(error);
                if(error.code === "auth/email-already-in-use"){
                    req.flash("error_msg" , "This email address is currently in use");
                    res.redirect('/auth/register');
                }else{
                    req.flash("error_msg" , "Invalid Registration Attempt");
                    res.redirect('/auth/register');
                }
            });
    }

});

module.exports = router;