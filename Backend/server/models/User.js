const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      default: ""
    },

    dob: {
      type: String,
      default: ""
    },

    state: {
      type: String,
      default: ""
    },

    district: {
      type: String,
      default: ""
    },

    village: {
      type: String,
      default: ""
    },

    pincode: {
      type: String,
      default: ""
    },

    farmSize: {
      type: Number,
      default: null
    },

    landUnit: {
      type: String,
      default: "Acres"
    },

    soilType: {
      type: String,
      default: ""
    },

    mainCrop: {
      type: String,
      default: ""
    },

    irrigation: {
      type: String,
      default: ""
    },

    experience: {
      type: Number,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);