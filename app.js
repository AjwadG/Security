require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const { functions } = require('lodash');


const app = express();

 app.set("view engine", "ejs")
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static("public"))


app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());



 main().catch(err => console.log(err));


async function main (){

    mongoose.connect("mongodb://127.0.0.1:27017/userDB");

    const userSchema = new mongoose.Schema({
        email: String,
        password: String
    })

    userSchema.plugin(passportLocalMongoose);
    
    const User = new mongoose.model("User", userSchema);


    passport.use(User.createStrategy());

    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());



    app.get("/", function(req, res){
        res.render("home")
    })


    app.get("/login", function(req, res){
        res.render("login", {msg: ""})
    })

    app.post('/login',
    passport.authenticate('local', { successRedirect: '/secrets', failWithError: true }),
    function(err, req, res, next) {
        res.render("login", {msg: "Wrong Username or Password"})
    });



    // app.post("/login",async function(req, res){
    //         const user = new User({
    //             username : req.body.username,
    //             password : req.body.password
    //         })
    //       req.login(user, function(err, a) {
    //         console.log(user);
    //         if (err) { 
    //             console.log(err); 
    //             res.render("login", {msg: "Wrong Username or Password"})
    //         } else {
                
    //         }
            
    //     });
    //     })

    app.route("/register")
        .get
        (function(req, res){
        res.render("register")
        })
        .post(async function(req, res){
            const username = req.body.username;
            const password = req.body.password
            User.register({username:username}, password, function(err, user) {
                if (err) {
                    console.log(err);
                    res.redirect("/register");
                  } else {
                        passport.authenticate("local")(req, res , function() {
                            res.redirect("/secrets");
                        });
                    }
            })
        });
        

        app.get("/secrets", function(req, res){
            if (req.isAuthenticated()){
            res.render("secrets");
            } else {
                res.redirect("/login");
            }
        })


        app.route("/submit")
        .get
        (function(req, res){
        res.render("submit")
        })
        .post(async function(req, res){
            res.render("submit")
        });
    
        app.get("/logout", function(req, res){
            req.logout(function(err) {
                if (err) { console.log(err); } else {
                    res.redirect('/');
                }
                
            })
        })
    


    app.listen(3000, function(){
        console.log("server started at port 3000");
    })

};
