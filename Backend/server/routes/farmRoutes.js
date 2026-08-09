const express = require("express");

const {
  createFarm,
  getFarms,
  updateFarm,
  deleteFarm,
} = require("../controllers/farmController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE
router.post("/", protect, createFarm);


// READ
router.get("/", protect, getFarms);


// UPDATE
router.put("/:id", protect, updateFarm);


// DELETE
router.delete("/:id", protect, deleteFarm);


module.exports = router;