const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connect = require("./Db/connect");

<<<<<<< HEAD
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const genresRouter = require("./routes/genresRoute");
const movieRouter = require("./routes/movieRoute");
const commentRouter = require("./routes/commentRoute");
=======
const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const genresRouter = require("./routes/genres.route");
const movieRouter = require("./routes/movie.route");
const commentRouter = require("./routes/comment.route");
>>>>>>> 3b7c1e6 (the firt commit)

const app = express();
// khai báo cổng
const port = 8888;

// connect database
connect();

// config
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

// listen
app.listen(port, () => {
  console.log("Ứng dụng đang chạy trên cổng " + port);
});

// api
app.use("/api/comment", commentRouter);
app.use("/api/user", userRouter);
app.use("/api/genres", genresRouter);
app.use("/api/auth", authRouter);
app.use("/api", movieRouter);
