const mongoose = require("mongoose");
const config = require("config-lite")(__dirname);

mongoose.connect(config.mongodb);

const db = mongoose.connection;

db.once("open", () => {
  console.log("数据库连接成功！");
});

db.on("error", () => {
  console.error(`Error in Mongodb ${error}`);
  mongoose.disconnect();
});
