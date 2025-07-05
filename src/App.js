const express = require("express");
const connectDB = require("./Config/Database");
const app = express();
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  //Creating a new Instance of new Model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully !!");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

//Get User By Email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne();

    if (!user) {
      res.send("User not Found");
    } else res.send(user);
    // const users = await User.find({});
    // if (users.length === 0) {
    //   res.status(404).send("There is no match");
    // }
    // res.send(users);
  } catch (err) {
    res.status(400).send("Something went Wrong");
  }
});

//Feed API -Get /feed ->Get all Users from DB
app.get("/feed", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("There is no match");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user Deleted Successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err.message);
  }
});
connectDB()
  .then(() => {
    console.log("Database Connected !!");
    app.listen(3000, () => {
      console.log("Server is Running in port 3000");
    });
  })
  .catch((err) => {
    console.log("Databse connnot be connected");
  });
