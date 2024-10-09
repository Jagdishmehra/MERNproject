const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { connectdb } = require("./config/Database");
const { UserModel } = require("./models/Schema");
const userAuth = require("./middlewares/userAuth");
const app = express();

// we will use a middleware to convert our data into js object
app.use(express.json());
app.use(cookieParser());
//User signUp posting data to db
app.post("/signup", async (req, res) => {
  const { password, firstName, lastName, age, gender, email } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
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
//User login
app.post("/login", async (req, res) => {
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
        const token = await jwt.sign({ id: user._id }, "JagdishTinder#12");
        res.cookie("token", token);
        return res.send("LogedIn Successfully");
      }
    }
  } catch (err) {
    res.status(400).send("Invalid Credentials:" + err.message);
  }
});
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Invalid Token" + err.message);
  }
});
// now we need to get all the data from the db to show it in feed
app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find({});
    if (users.length) {
      res.send(users);
    } else {
      res.send("user not found");
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});
// deleting a user from the db
app.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findOneAndDelete(id);
    res.send("User Account Deleted Sucessfully");
  } catch (err) {
    res.status(400).send("Something went wrong try again after sometime");
  }
});
// updating a user info
app.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const ALLOWED_UPDATES = ["age", "gender", "photoURL", "skills"];
  const isAllowed = Object.keys(data).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );
  if (!isAllowed) {
    return res.status(400).send("Update not Allowed");
  }
  try {
    await UserModel.findByIdAndUpdate(id, data, { runValidators: true });
    return res.send("User Updated Sucessfully");
  } catch (err) {
    return res.status(400).send("Something went wrong:" + err.message);
  }
});
connectdb()
  .then(() => {
    console.log("db connected succesfully");
    app.listen(3000, () => {
      console.log("this server is running on port 3000 sucessfully");
    });
  })
  .catch((err) => {
    console.log("error occured during connection", err);
  });
