var express = require('express');
var router = express.Router();
var session = require('express-session');
var firebase = require('firebase');

router.get('/', function(req, res, next){
    res.redirect('/home');
});

router.get('/home', async function(req, res, next) {
    if (req.session.success == true) {
        let userProfile = await firebase.database().ref('users/').child(req.session.uid).once('value');
        let userList = await firebase.database().ref('accounts/').once('value');
        res.render('pages/home', { username: req.session.username, uids: req.session.uid, user: userProfile.val(), users: userList.val(), errors:[]});
    } else {
        res.redirect('/auth/login');
    }
});

router.post('/transfer/:uid', async function(req,res,next) {
    if (req.session.success == true) {
        let userProfile = await firebase.database().ref('users/').child(req.session.uid).once('value');
        let userList = await firebase.database().ref('accounts/').once('value');
        let currentBalance = await firebase.database().ref('users/').child(req.session.uid).child('balance').once('value');
        if (currentBalance.val() < req.body.amount ){
            req.flash('error', 'Insufficient Funds');
        }else{
            let newBalance = currentBalance.val() - req.body.amount;
            let transaction = {
                "from": userProfile.val().firstName + " " + userProfile.val().lastName,
                "to": userList.val()[req.params.uid].Name,
                "amount": req.body.amount
            }
            firebase.database().ref('users/').child(req.session.uid).child('balance').set(newBalance);
            firebase.database().ref('users/').child(req.session.uid).child('transactions').push(transaction);
            firebase.database().ref('users/').child(req.params.uid).child('transactions').push(transaction);
        }
        res.redirect('/home');
    } else {
        res.redirect('/auth/login');
    }
});

module.exports = router;