//requiring important modules
//put dotenv right on top of the file
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser= require("body-parser");
const encrypt = require("mongoose-encryption")

//use required stuff

const app = express();
mongoose.connect('mongodb://localhost/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({
    extended:true
}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

//let's code it
const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields:["password"] });
const User = mongoose.model("User",userSchema);
app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

//create a new user

app.post("/register",function(req,res){
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err,results){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    });
});

//login a registered user

app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password===password){
                    res.render("secrets");
                }
            }
        }
    })
});
app.listen(3000, function(){
    console.log("Server started on port 3000");
});