const Activity = require("../models/Activity");
const Farm = require("../models/Farm");

// CREATE ACTIVITY
const createActivity = async (req, res) => {
  try {
    const {
      farmId,
      activityType,
      date,
      crop,
      quantity,
      quantityUnit,
      notes,
    } = req.body;

    if (!farmId || !activityType || !date || !crop) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    // Check that the farm belongs to the logged-in farmer
    const farm = await Farm.findOne({
      _id: farmId,
      farmerId: req.userId,
    });

    if (!farm) {
      return res.status(404).json({
        message: "Farm not found or not authorized.",
      });
    }

    const activity = await Activity.create({
      farmerId: req.userId,
      farmId,
      activityType,
      date,
      crop,
      quantity: quantity || null,
      quantityUnit: quantityUnit || "",
      notes: notes || "",
    });

    res.status(201).json({
      message: "Activity added successfully!",
      activity,
    });

  } catch (error) {
    console.error("Create Activity Error:", error);

    res.status(500).json({
      message: "Server error while adding activity.",
    });
  }
};


// GET ACTIVITIES
const getActivities = async (req, res) => {
  try {

    const activities = await Activity.find({
      farmerId: req.userId,
    })
      .populate("farmId", "fieldName")
      .sort({
        date: -1,
      });

    res.status(200).json({
      activities,
    });

  } catch (error) {

    console.error("Get Activities Error:", error);

    res.status(500).json({
      message: "Server error while loading activities.",
    });
  }
};

// =====================================
// UPDATE ACTIVITY
// =====================================

const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      farmId,
      activityType,
      date,
      crop,
      quantity,
      quantityUnit,
      notes,
    } = req.body;

    if (!farmId || !activityType || !date || !crop) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const farm = await Farm.findOne({
      _id: farmId,
      farmerId: req.userId,
    });

    if (!farm) {
      return res.status(404).json({
        message: "Farm not found or not authorized.",
      });
    }

    const activity = await Activity.findOne({
      _id: id,
      farmerId: req.userId,
    });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found or not authorized.",
      });
    }

    activity.farmId = farmId;
    activity.activityType = activityType;
    activity.date = date;
    activity.crop = crop;
    activity.quantity =
      quantity === "" ? null : quantity;
    activity.quantityUnit = quantityUnit || "";
    activity.notes = notes || "";

    await activity.save();

    res.status(200).json({
      message: "Activity updated successfully!",
      activity,
    });

  } catch (error) {
    console.error("Update Activity Error:", error);

    res.status(500).json({
      message: "Server error while updating activity.",
    });
  }
};


// =====================================
// DELETE ACTIVITY
// =====================================

const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity =
      await Activity.findOneAndDelete({
        _id: id,
        farmerId: req.userId,
      });

    if (!activity) {
      return res.status(404).json({
        message: "Activity not found or not authorized.",
      });
    }

    res.status(200).json({
      message: "Activity deleted successfully!",
    });

  } catch (error) {
    console.error("Delete Activity Error:", error);

    res.status(500).json({
      message: "Server error while deleting activity.",
    });
  }
};


// EXPORT FUNCTIONS
module.exports = {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
};