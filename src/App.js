const express = require("express");
const connectDB = require("./Config/Database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { useAuth, userAuth } = require("./Middlewares/Auth");
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
  try {
    //Validation
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, age } = req.body;
    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //Creating a new Instance of new Model
    const user = new User({
      firstName,
      lastName,
      emailId,
      age,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully !!");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //Create a JWT Token
      const token = await jwt.sign({ _id: user._id }, "Aniket@7681$", {
        expiresIn: "1d",
      });
      console.log(token);

      //Add the token to cookie

      res.cookie("token", token);
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  //Sending a Connection request
  const user = req.user;

  console.log("Sending a Connection Request");
  res.send(user.firstName + " Sent a Connection Request !");
});

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
