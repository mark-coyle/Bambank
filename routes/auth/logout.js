var express = require('express');
var router = express.Router();
var session = require('express-session');
var firebase = require('firebase');

// Logout
router.get('/', function(req, res, next) {
    if (req.session.success == true) {
        req.session.destroy();
        firebase.auth().signOut().then(function() {
            res.redirect('/auth/login');
        }).catch(function(error) {
            console.log(error);
        });

    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;