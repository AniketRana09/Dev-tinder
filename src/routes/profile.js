const express = require("express");
const profileRouter = express.Router();
const { validateEditProfileData } = require("../utils/validation");
const { userAuth } = require("../Middlewares/Auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Error Request");
    }

    const LoggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (LoggedInUser[key] = req.body[key]));
    await LoggedInUser.save();
    res.json({
      message: `${LoggedInUser.firstName} your profile is updated`,
      data: LoggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
