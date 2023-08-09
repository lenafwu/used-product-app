// dependencies

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const cors = require("cors");

// routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");
const adRouter = require("./routes/ad");

const app = express();

app.use(logger("dev"));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

// TODO: delete this : test
app.use((req, res, next) => {
  console.log(req.headers);
  console.log(req.body);
  next();
});

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// enable CORS
app.use(cors());

// set up passport
app.use(passport.initialize());

// app.get("/", (req, res) => {
//   res.send("Page under construction");
// });

app.use("/api", apiRouter);
app.use("/ad", adRouter);

// // catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
    },
  });
});

module.exports = app;
