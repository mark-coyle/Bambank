const express = require("express");
const helmet = require("helmet");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const firebase = require("firebase");
const validator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
require("dotenv").config();

const port = process.env.PORT || 8081;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(validator());
app.use(express.static(__dirname + "/public"));
app.use(morgan("common"));

app.set("views", path.join(__dirname, "views"));
app.engine("ejs", require("express-ejs-extend"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(process.env.SECRET_ID));
app.use(
  session({
    secret: process.env.SECRET_ID,
    saveUninitialized: true,
    resave: true
  })
);

app.use(flash());
app.use(function(req, res, next) {
  res.locals.uid = req.session.uid;
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(require("./routes"));

const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGE_SENDER_ID
};
firebase.initializeApp(config);

app.listen(port, () => {
  console.log(
    "Listening on port " + port + " in " + process.env.NODE_ENV + " mode"
  );
});
module.exports = app;
