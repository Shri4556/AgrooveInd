const mongoose = require("mongoose");

const advisorySchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
      trim: true,
    },

    soilType: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    sowing: {
      type: String,
      default: "",
    },

    irrigation: {
      type: String,
      default: "",
    },

    fertilizer: {
      type: String,
      default: "",
    },

    pestManagement: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Advisory", advisorySchema);