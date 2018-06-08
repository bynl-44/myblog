const postsRouter = require("./posts");
const userRouter = require("./user");

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render("index", { title: "Express" });
  });
  app.use("/posts", postsRouter);
  app.use("/user", userRouter);
};
