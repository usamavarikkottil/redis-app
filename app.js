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
app.get("/", (req, res, next) => {
res.render("searchusers");
});


// Search processs
app.post("/users/search", (req, res, next) => {

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

app.listen(port, () => console.log(`Server Started on port ${port}`));