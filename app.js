var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// 引入 express-session 和 connect-mongo 模块
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
// 引入 config-lite，读取配置文件
const config = require("config-lite")(__dirname);
const db = require("./mongodb/db");

// 引入路由
const routes = require("./routes");
// 引入 package，用于设置全局常量
const pkg = require("./package");

// 生成一个 express 实例 app
var app = express();

// 视图模板文件目录
app.set("views", path.join(__dirname, "views"));
// 设置模板引擎
app.set("view engine", "ejs");
// 加载日志中间件
app.use(logger("dev"));
// 加载解析 json 中间件
app.use(express.json());
// 加载解析 urlencoded 请求体的中间件
app.use(express.urlencoded({ extended: false }));
// 加载解析 cookie 的中间件
app.use(cookieParser());
// 加载 session 中间件
app.use(
  session({
    name: config.session.key, // 设置 cookie 中保存 session ID 的字段名
    secret: config.session.secret, // 设置 secret，来生成 signedCookie，即加密
    resave: true, // 强制更新 session
    saveUninitialized: false, // 强制创建一个 session，即使用户未登录
    cookie: { maxAge: config.session.maxAge }, // 设置 cookie 过期时间
    store: new MongoStore({
      // 将 session 存储到 mongodb 中
      url: config.mongodb
    })
  })
);

// flash 中间件，用来显示通知
app.use(flash());

// 设置 public 文件夹为存放静态资源的目录
app.use(express.static(path.join(__dirname, "public")));
// 设置模板全局常量
// ps. 要放在路由 routes 前面
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
};
// 添加模板必需的三个变量
// ps. 要放在路由 routes 前面
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash("success").toString();
  res.locals.error = req.flash("error").toString();
  next();
});

// 设置路由控制器
routes(app);

// 捕获 404 错误，并转发到错误处理器
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理
app.use(function(err, req, res, next) {
  // development：开发环境下的错误处理器
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // development：将错误信息渲染 error 模板，并显示到浏览器中
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
