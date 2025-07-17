const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE}  is not Valid`,
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

//whenever writing db function try to write it like this and not by arrow function

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if fromUserId is same as toUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send request to yourself");
  }
  next();
});
// Model name always start with capital Letters
const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = ConnectionRequest;
