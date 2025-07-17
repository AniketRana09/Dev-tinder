const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../Middlewares/Auth");
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      // it comes from userAuth middleware which gives info of logged In User
      const fromUserId = req.user._id;
      //it comes from user Params i.e upper api
      const toUserId = req.params.userId;
      const status = req.params.status;
      // So that only  ignored and interested  is given
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: `Invalid Request  Type: ${status}`,
        });
      }

      //If there is an existing Connection request
      const existToUserId = await User.findById(toUserId);
      if (!existToUserId) {
        return res.status(404).send({
          message: "User not found",
        });
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId }, // A → B
          { fromUserId: toUserId, toUserId: fromUserId }, //B →A
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send({
          message: ` Request Already Exists :)`,
        });
      }
      // console.log("fromUserID :" + fromUserId);
      // console.log("toUserID: " + toUserId);
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message: `${req.user.firstName}  is ${status} in ${existToUserId.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
    console.log("Sending a Connection Request");
  }
);
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }
      console.log("RequestId:", requestId);
      console.log("To User ID:", loggedInUser._id);
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection Request not Found",
        });
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request " + status,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  }
);
module.exports = requestRouter;
