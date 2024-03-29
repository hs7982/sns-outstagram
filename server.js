const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const sessiondb = require("express-mysql-session")(session);
const db = require("./database/db");
const path = require("path");

const app = express();
const api = require("./router/api");
const user = require("./router/user");
const posts = require("./router/posts");

dotenv.config();

app.use(express.json());
var cors = require("cors");

app.use(cors());

const dbConfig = {
  host: "127.0.0.1",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  connectionLimit: 5,
  enableKeepAlive: true,
};

db.connect((err) => {
  if (err) {
    console.error("DB에 연결하는데 실패하였습니다:", err);
  } else {
    console.log("DB 연결 성공");
    // 매 3시간마다 DB 연결 유지
    setInterval(() => {
      db.query('SELECT 1', (error, result) => {
        if (error) {
          console.error('DB 연결 유지 중 오류 발생:', error);
        } else {
          console.log('DB 연결 유지 성공');
        }
      });
    }, 3 * 60 * 60 * 1000); // 3시간(180분)마다 실행
  }
});

const SECRET_KEY = process.env.TOKEN_SECRET;
app.use(cookieParser(SECRET_KEY));
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new sessiondb(dbConfig),
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use((err, req, res, next) => {
  console.log("error middleware");
  console.log(err.toString());
  res.status(500).json({ error: "Internal Server Error" });
});

app.use("/api/user", user);
app.use("/api/posts", posts);
app.use("/api/upload", express.static("./upload"));

app.use("/api/", api);

// const root = require('path').join(__dirname, 'client', 'build')
// app.use(express.static(root));
// app.get("*", (req, res) => {
//     res.sendFile('index.html', { root });
// })

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listening Back-End api server on port ${port}`);
});
