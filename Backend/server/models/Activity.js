const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    farmId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true
    },

    activityType: {
      type: String,
      enum: [
        "Sowing",
        "Irrigation",
        "Fertilizer",
        "Pesticide",
        "Harvest"
      ],
      required: true
    },

    date: {
      type: Date,
      required: true
    },

    crop: {
      type: String,
      required: true
    },

    quantity: {
      type: Number,
      default: null
    },

    quantityUnit: {
      type: String,
      default: ""
    },

    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);