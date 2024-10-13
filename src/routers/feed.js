const express = require("express");
const { UserModel } = require("../models/Schema");
const userAuth = require("../middlewares/userAuth");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const route = express.Router();

route.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const ignoreUserFeed = new Set();
    connectionRequest.forEach((element) => {
      ignoreUserFeed.add(element.toUserId.toString()),
        ignoreUserFeed.add(element.fromUserId.toString());
    });
    const data = await UserModel.find({
      _id: { $nin: Array.from(ignoreUserFeed) },
    }).select("firstName lastName age gender photoURL");
    res.json({ data });
  } catch (err) {
    res.status(404).json({ message: "Error fetching data:" + err.message });
  }
});

module.exports = route;
