const express = require('express');
const exhb = require("express-handlebars");
const path = require("path");
const redis = require("redis");
const methodOverride = require("method-override");

// Create redis client
let client = redis.createClient();
client.on("connect", () => {
    console.log("connected to redis...");
})
// Setting port
const port = 5000;

// Init express
const app = express();

// View engine
app.engine("handlebars", exhb({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(methodOverride("_method"));

// Routes

// Search page
app.get("/", (req, res) => {
res.render("searchusers");
});

// Add user Page
app.get("/user/add", (req, res) => {
    res.render("addusers");
});

// Search processs
app.post("/users/search", (req, res) => {

    let id = req.body.id;
    client.hgetall(id, function (err, obj) {
        
        if (!obj) {
            res.render("searchusers", { error: "user does not exists..."});
            
        } else {
            obj.id = id;
            res.render("details", {user: obj})
            
        }
    })

})

// Add User Process
app.post("/user/add", (req, res) => {

    let id = req.body.id;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phone = req.body.phone;
    client.hset(id,[
        "firstName",firstName, "lastName", lastName, "email",email, "phone", phone
    ] ,function (err, obj) {
        
        if (err) {
            res.send(err);
            
        } else {
        //    console.log(obj);
           res.redirect("/");
            
        }
    })

})

// Process DELETE User

app.delete("/user/delete/:userId", (req, res) => {
client.del(req.params.userId);
res.redirect("/");
})

app.listen(port, () => console.log(`Server Started on port ${port}`));