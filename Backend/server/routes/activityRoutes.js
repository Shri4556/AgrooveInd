const express = require("express");

const {
  createActivity,
  getActivities,
  updateActivity,
  deleteActivity,
} = require("../controllers/activityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================
// CREATE
// =====================================

router.post("/", protect, createActivity);


// =====================================
// GET ALL
// =====================================

router.get("/", protect, getActivities);


// =====================================
// UPDATE
// =====================================

router.put("/:id", protect, updateActivity);


// =====================================
// DELETE
// =====================================

router.delete("/:id", protect, deleteActivity);


module.exports = router;