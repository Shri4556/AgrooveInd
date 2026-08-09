const express = require("express");

const {
  getAdvisory,
  getAllAdvisories,
} = require("../controllers/advisoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get advisory by crop and soil type
router.get("/", protect, getAdvisory);

// Get all advisories
router.get("/all", protect, getAllAdvisories);

module.exports = router;