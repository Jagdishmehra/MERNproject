const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const { UserModel } = require("../models/Schema");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { password, firstName, lastName, age, gender, email } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new UserModel({
      firstName,
      lastName,
      email,
      age,
      gender,
      password: passwordHash,
    });

    await user.save();
    res.send("user added succesfully 1");
  } catch (err) {
    res.status(400).send("err occured :" + err.message);
  }
});
router.post("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid credentials: User not found");
    } else {
      const hashPass = await bcrypt.compare(password, user.password);
      if (!hashPass) {
        return res.status(401).send("Invalid Credentials");
      } else {
        const token = await jwt.sign({ id: user._id }, "JagdishTinder#12", {
          expiresIn: "1d",
        });
        res.cookie("token", token);
        return res.send("User LogedIn Successfully");
      }
    }
  } catch (err) {
    res.status(400).send("Invalid Credentials:" + err.message);
  }
});
router.post("/logout", (req, res) => {
  res.clearCookie("token").send("User logged out succesfully");
});

module.exports = router;
