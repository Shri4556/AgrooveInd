const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fieldName: {
      type: String,
      required: true,
      trim: true
    },

    area: {
      type: Number,
      required: true
    },

    areaUnit: {
      type: String,
      enum: ["Acres", "Hectares"],
      default: "Hectares"
    },

    mainCrop: {
      type: String,
      required: true
    },

    soilType: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Farm", farmSchema);