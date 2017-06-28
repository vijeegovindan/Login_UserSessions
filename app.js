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
var jsonfile = require('jsonfile');
var file = 'data.json';

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

jsonfile.readFile(file, function(err, obj){
  if(err) {
    console.error("Error reading from Json file: "+ file);
    console.error(err.stack);
    process.exit(1);
  }
  obj.login_users.forEach(function(user){
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
    }}
  });
});

app.get("/login", function(req, res) {
  res.render("login");
});
//Listen to app
app.listen(8080, function(){
  console.log("App is listening - Port: 8080");
});
