const express = require("express");
const userAuth = require("../middlewares/userAuth");
const { UserModel } = require("../models/Schema");
const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Invalid Token" + err.message);
  }
});
router.patch("/profile/update", userAuth, async (req, res) => {
  try {
    const UpdateduserInfo = req.body;
    const loggedInUserInfo = req.user;

    const ALLOWED_UPDATES = [
      "firstName",
      "age",
      "gender",
      "photoURL",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(UpdateduserInfo).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid Data update");
    }
    Object.keys(UpdateduserInfo).forEach(
      (key) => (loggedInUserInfo[key] = UpdateduserInfo[key])
    );
    loggedInUserInfo.save();
    res.send(`${loggedInUserInfo.firstName} your profile updated sucessfully`);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = router;
