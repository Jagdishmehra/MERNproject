const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { ConnectionRequestModel } = require("../models/connectionRequests");
const router = express.Router();
const POPULATE_USER_DATA = "firstName lastName age gender photoURL";

router.get("/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedConnectionReq = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", POPULATE_USER_DATA);

    const data = receivedConnectionReq.map((data) => data.fromUserId);
    res.json({
      message: "All connection request you have received",
      data,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", POPULATE_USER_DATA);
    const connectionData = connections.map((row) => row.fromUserId);
    res.json({ connectionData });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
