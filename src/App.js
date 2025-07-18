const express = require("express");
const connectDB = require("./Config/Database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

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
