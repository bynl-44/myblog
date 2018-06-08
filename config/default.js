module.exports = {
  port: 3000, // 端口
  session: {
    // express-session 的配置信息
    secret: "myblog",
    key: "myblog",
    maxAge: 1000 * 60 * 60 * 24 * 30
  },
  mongodb: "mongodb://localhost:27017/myblog" // mongodb 的地址，myblog 为数据库名
};
