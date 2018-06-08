const UserModel = require("../models/user");
const crypto = require("crypto");

class User {
  constructor() {
    this.signin = this.signin.bind(this);
    this.signup = this.signup.bind(this);
    this.signout = this.signout.bind(this);
  }
  MD5(password) {
    const md5 = crypto.createHash("md5");
    return md5.update(password).digest("base64");
  }
  encryption(password) {
    return this.MD5(this.MD5(password).substr(2, 7) + this.MD5(password));
  }
  async signin(req, res, next) {
    let { name, password } = req.body;
    try {
      if (!name) {
        throw new Error("用户名参数错误");
      } else if (!password) {
        throw new Error("密码参数错误");
      }
    } catch (e) {
      console.log(e.message, e);
      req.flash("error", "用户名或密码错误");
      res.redirect("back");
      return;
    }
    const newpassword = this.MD5(password);
    try {
      const user = await UserModel.findOne({ name });
      if (!user) {
        req.flash("error", "用户不存在");
        res.redirect("back");
      } else if (password.toString() !== newpassword.toString()) {
        console.log("用户密码错误");
        req.flash("error", "用户名或密码错误");
        res.redirect("back");
      } else {
        req.session.user = user;
        res.redirect("/");
      }
    } catch (e) {
      console.log("用户登录失败", e);
      req.flash("error", "登录失败");
      res.redirect("back");
    }
  }

  async signup(req, res, next) {
    let { name, password, passwordRepeat } = req.body;
    try {
      if (!name) {
        throw new Error("用户名参数错误");
      } else if (
        !password ||
        password.toString() !== passwordRepeat.toString()
      ) {
        throw new Error(密码参数错误);
      }
    } catch (e) {
      console.log(e.message, e);
      req.flash("error", "用户名或密码错误");
      res.redirect("back");
      return;
    }
    const newpassword = this.MD5(password);
    try {
      console.log(newpassword);
      const user = await UserModel.findOne({ name });
      console.log(user);
      if (user) {
        console.log("该用户已存在");
        req.flash("error", "该用户已存在");
        res.redirect("back");
      } else {
        const newUser = {
          name: name,
          password: newpassword
        };
        await UserModel.create(newUser);
        req.session.user = newUser;
        req.flash("success", "用户注册成功");
        res.redirect("/");
      }
    } catch (e) {
      console.log("用户注册失败", e);
      req.flash("error", "用户注册失败");
      res.redirect("back");
    }
  }

  async signout(req, res, next) {
    try {
      delete req.session.user;
      req.flash("success", "退出成功");
      res.redirect("/");
    } catch (e) {
      console.log("退出失败");
      req.flash("error", "退出失败");
      res.redirect("back");
    }
  }
}

module.exports = new User();
