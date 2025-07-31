const express = require("express");
const connectDB = require("./Config/Database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://devtinder-front-end.vercel.app/",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
// app.options(
//   "*",
//   cors({
//     origin: "https://devtinder-front-end.vercel.app",
//     credentials: true,
//   })
// );
//change it to local host when working in production
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database Connected !!");
    app.listen(3000, () => {
      console.log("Server is Running in http://localhost:3000");
    });
  })
  .catch((err) => {
    console.log("Databse connnot be connected");
  });
