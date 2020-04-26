var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStratergy        = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app", );

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "I dont care about apple!",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//================
//ROUTES

//================

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret",isLoggedIn, function(re1, res){
    res.render("secret");
});

//================
//AUTH ROUTES
app.get("/register", function(req, res){
    res.render("register");
})
//================

//handling user signup
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secret");
            });
        }
    });
})

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
    res.render("login"); 
 });
 //login logic
 //middleware
 app.post("/login", passport.authenticate("local", {
     successRedirect: "/secret",
     failureRedirect: "/login"
 }) ,function(req, res){
 });
//LOGOUT ROUTE
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");   
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


app.listen("3000", function(){
    console.log("server has started");
});