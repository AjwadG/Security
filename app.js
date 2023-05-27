require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds =10;

const app = express();

 app.set("view engine", "ejs")
 app.use(bodyParser.urlencoded({extended: true}));
 app.use(express.static("public"))

 main().catch(err => console.log(err));


async function main (){

    mongoose.connect("mongodb://127.0.0.1:27017/userDB");

    const userSchema = new mongoose.Schema({
        email: String,
        password: String
    })
    

    const User = new mongoose.model("User", userSchema);



    app.get("/", function(req, res){
        res.render("home")
    })


    app.route("/login")
        .get(function(req, res){
            res.render("login", {msg: "",})
        })
        .post(async function(req, res){
            await User.findOne({email: req.body.username})
            .then(table => {
            bcrypt.compare(req.body.password, table.password, async function(err, result) {
                if (result === false) res.render("login", {msg: "Wrong username or password"})
                else res.render("secrets")
            });
            })
        })

    app.route("/register")
        .get
        (function(req, res){
        res.render("register")
        })

        .post(async function(req, res){
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            
            const newUser = User({
                email: req.body.username,
                password: hash
            }) 
            newUser.save().then(() => res.render("secrets"))
            .catch(err => console.log(err))

            });
        });
    


        app.get("/logout", function(req, res){
            res.redirect("/")
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
            res.redirect("/")
        })
    


    app.listen(3000, function(){
        console.log("server started at port 3000");
    })

};
