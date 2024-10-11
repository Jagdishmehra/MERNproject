//creating a new schema for connection requests so that it does not get messed up
const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "rejected", "accepted"],
        message: "{VALUE} not a valid status type",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//converting that schema into model
const ConnectionRequestModel = new mongoose.model(
  "connectionRequestModel",
  connectionRequestSchema
);

module.exports = { ConnectionRequestModel };
