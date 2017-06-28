// Headers
const express = require('express');
const expressValidator = require('express-validator');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname,"public")));
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

// Initialize Express Session
app.use(session({
  secret: 'sssshhh hhhh',
  resave: false,
  saveUninitialized: false
}));

let messages = [];
let login_users = [{"username":"user1","password":"password"},
                {"username":"user2","password":"password"},
                {"username":"user3","password":"password"}];

app.get("/", function(req,res){
    if(req.session.username){
        res.render("index", {user:req.session.username});
      }
      else{
        res.render("login");
      }
});

app.post("/index", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.post("/login", function(req, res) {

let loggedUser;
let flag = false;

req.checkBody("username", "Please enter a valid username").notEmpty().isLength({max: 30});
req.checkBody("password", "Please enter a Password").notEmpty();

login_users.forEach(function(user){
  if (user.username === req.body.username) {
    loggedUser = user;
    flag = true;
  }
});

if(flag){
  req.checkBody("password", "Invalid password and username combination.").equals(loggedUser.password);
}

let errors = req.validationErrors();

if (errors) {
  errors.forEach(function(error){
  messages.push(error.msg);
  });
  res.render("login", {errors: messages});
}
else{
  if(flag) {
    req.session.username = req.body.username;
    res.redirect("/");
    }
  else {
    res.render("login", {errors: "Invalid login. Enter valid credentials"});
    }
  }
});

app.get("/login", function(req, res) {
  console.log("I m here");
  res.render("login");
});
//Listen to app
app.listen(8080, function(){
  console.log("App is listening - Port: 8080");
});
