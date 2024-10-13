// this route is for connection requests handling
const express = require("express");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const userAuth = require("../middlewares/userAuth");
const { UserModel } = require("../models/Schema");
const route = express.Router();

route.post(
  "/connection/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;

      const ALLOWED_STATUS = ["ignored", "interested"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).send("Invalid status type");
      }
      if (fromUserId.equals(toUserId)) {
        return res.send("Cannot send request to yourself");
      }

      const dataFromDb = await UserModel.findById(toUserId);
      if (!dataFromDb) {
        return res.status(404).send("User does not exist");
      }

      const existingUser = await ConnectionRequestModel.findOne({
        $or: [
          { toUserId, fromUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingUser) {
        return res.status(400).send("Request already exist");
      }

      const connectionRequest = new ConnectionRequestModel({
        toUserId,
        fromUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: `Request ${status} sucessfully`,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);
//now we will write logic to review the connection request sent by user
route.get(
  "/connection/request/:review/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const requestId = req.params.requestId;

      const status = req.params.review;

      const loggedInUser = req.user;

      const ALLOWED_STATUS = ["accepted", "rejected"];
      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).send("Action not allowed");
      }
      const findConnectionRequest = await ConnectionRequestModel.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!findConnectionRequest) {
        return res.status(404).send("Request not Found ");
      }
      findConnectionRequest.status = status;
      const data = await findConnectionRequest.save();
      res.json({
        message: `Connection request ${status}`,
        data,
      });
    } catch (err) {
      res.status(404).send("Request not Found" + err.message);
    }
  }
);
module.exports = route;
