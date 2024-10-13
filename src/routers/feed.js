const express = require("express");
const { UserModel } = require("../models/Schema");
const userAuth = require("../middlewares/userAuth");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const route = express.Router();

route.get("/feed", userAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;
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
    })
      .select("firstName lastName age gender photoURL")
      .skip(skip)
      .limit(limit);
    res.json({ data });
  } catch (err) {
    res.status(404).json({ message: "Error fetching data:" + err.message });
  }
});

module.exports = route;

// add a limit check to the feed api page.
