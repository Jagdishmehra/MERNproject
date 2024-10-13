const mongoose = require("mongoose");
const validator = require("validator");

const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: { type: String, required: true, maxLength: 20, minLength: 2 },
    lastName: { type: String, required: true, maxLength: 20, minLength: 2 },
    age: { type: Number, required: true, min: 18 },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Define Gender Correctly");
        }
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email : " + value);
        }
      },
    },
    photoURL: {
      type: String,
      default:
        "https://imgs.search.brave.com/oi48X4-FIPhjGR6aDgwBq5pBYC_caU-LxJp7OMbFyUM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvbWFuLWF2YXRh/ci11c2VyLWljb24t/bWFuLWF2YXRhcl82/NDU2NTgtMzE4Ny5q/cGc_c2l6ZT02MjYm/ZXh0PWpwZw",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL not valid : " + value);
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length >= 10) {
          throw new Error("Max 10 skills allowed ");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Enter a strong password: Password must be of 8 char length"
          );
        }
      },
    },
  },
  { timestamps: true }
);

// step-2
// now for the step 2 we have to create model for our schema.
const UserModel = new mongoose.model("UserModel", userSchema);
// we have converted our schema in model so that we can easily perform any query or operations like
// CRUD directly in mongodb.

//step-3
//we have to export our model

module.exports = { UserModel };
