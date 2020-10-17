const express = require('express');
const exhb = require("express-handlebars");
const path = require("path");
const redis = require("redis");
const methodOverride = require("method-override");

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
app.get("/", (req, res, next) => {
res.render("searchusers");
});


app.listen(port, () => console.log(`Server Started on port ${port}`));