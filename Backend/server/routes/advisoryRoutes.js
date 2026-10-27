const express = require("express");

const {
  getAdvisory,
  getAllAdvisories,
  updateAdvisory,
  createAdvisory,
} = require("../controllers/advisoryController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Get advisory by crop and soil type
router.get("/", protect, getAdvisory);

// Get all advisories
router.get("/all", protect, getAllAdvisories);
router.post("/", protect, adminOnly, createAdvisory);
router.put("/:id", protect, adminOnly, updateAdvisory);


module.exports = router;