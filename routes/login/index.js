const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require('../../models/User');
const LocalStrategy = require("passport-local").Strategy;
const {userAuthenticated}  = require('../../helpers/authentication');


router.all('/*', (req, res, next)=>{ // anything after admin
    req.app.locals.layout = 'login';
    next();
});


router.get('/', (req, res) => {
    res.render('login/index');
});

// login

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done)=>{
    
    User.findOne({email: email}).then(user=>{
        if(!user) return done(null, false, {message: 'No user found'});

        bcrypt.compare(password, user.password, (err, matched)=>{
            if(err) return err;

            if(matched){
                return done(null, user);
            }else{
                return done(null, false, {message: 'Incorrect Password' });
            }
        });
    });


}));



passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



router.get('/login', (req,res)=>{
    res.render("login/index");
});

router.post('/login', (req,res,next)=>{

    passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect: '/login/login',
        failureFlash: true

    })(req,res,next);

    // res.send("loginz");
});

// log out
router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/login');
});



// register

router.get('/register', (req,res)=>{
    res.render("home/register");
});

router.post('/register', (req,res)=>{

    let errors = [];

    if(!req.body.firstName) {
        errors.push({message: 'please enter your first name'});
    }


    if(!req.body.lastName) {
        errors.push({message: 'please add a last name'});
    }

    if(!req.body.email) {
        errors.push({message: 'please add an email'});
    }

    if(!req.body.password) {
        errors.push({message: 'please enter a password'});
    }


    if(!req.body.passwordConfirm) {
        errors.push({message: 'This field cannot be blank'});
    }


    if(req.body.password !== req.body.passwordConfirm) {
        errors.push({message: "Password fields don't match"});
    }


    if(errors.length > 0){


        res.render('home/register', { // if err user back with data
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,

        })

    } else {

        User.findOne({email: req.body.email}).then(user=>{ //find user from db

            if(!user){ //checking if the email is exist

           

    const newUser = new User({ 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    });


    bcrypt.genSalt(10, (err,salt)=>{ //hash the password using bcrypt
        bcrypt.hash(newUser.password, salt, (err, hash)=>{
            newUser.password = hash;

            req.flash('success_message', 'You are now registered, Please Login');

            newUser.save().then(savedUser => {
                res.redirect('/register');
            });            
        });
    });

    } else { //if user end here 

        req.flash('error_message', 'account with the email already exist please login');

        res.redirect('/login');

    } 

}); // find user from db end here

    } //else err end here
});



module.exports = router;