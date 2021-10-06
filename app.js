var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// connect to database
// use require syntax to get mongoose in file
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/test", { useNewUrlParser: true });

// use mongoose's connection method to find the connected db
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected!!");
});

// 用 Schema() 去定義資料的欄位架構
var testSchema = new mongoose.Schema({
  id: Number,
  name: String,
});

// set method is to set Schema
testSchema.set("collection", "test");
var testModel = mongoose.model("test", testSchema);

// 新增資料
var content = new testModel({ id: 1, name: "User1" });

content.save(function (err) {
  if (err) console.log(err); // 儲存失敗

  // 儲存成功
  console.log("Success!!");
});

// 查詢資料
testModel.find(function (err, data) {
  if (err) console.log(err);
  console.log(data);
});

// 修改資料
testModel.update({ id: 1 }, { name: "User2" }, function (err) {
  if (err) console.log(err);
  console.log("update success");
});

// 刪除資料
testModel.remove({ id: 1 }, function (err) {
  if (err) console.log(err);
  console.log("delete success");
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
