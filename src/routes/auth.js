const express = require("express");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //coming from user model
      const token = await user.getJWT();
      //Add the token to cookie
      res.cookie("token", token);
      res.send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token").send();
  // res
  //   .cookie("token", null, {
  //     expires: new Date(Date.now()),
  //   })
  //   .send();
});

module.exports = authRouter;
