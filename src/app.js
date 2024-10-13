const express = require("express");
const cookieParser = require("cookie-parser");
const { connectdb } = require("./config/Database");
const { UserModel } = require("./models/Schema");
const app = express();
// we will use a middleware to convert our data into js object
app.use(express.json());
app.use(cookieParser());

const signup = require("./routers/auth");
const profile = require("./routers/profile");
const connectionRequest = require("./routers/connections");
const request = require("./routers/requests");
const feed = require("./routers/feed");
app.use("/", signup, profile, connectionRequest, request, feed);

// now we need to get all the data from the db to show it in feed

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

connectdb()
  .then(() => {
    console.log("db connected succesfully");
    app.listen(3000, () => {
      console.log("this server is running on port 3000 sucessfully");
    });
  })
  .catch((err) => {
    console.log("Error occured during connection :" + err.message);
  });
