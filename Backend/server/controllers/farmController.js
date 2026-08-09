const Farm = require("../models/Farm");

// =====================================
// CREATE FARM
// =====================================

const createFarm = async (req, res) => {
  try {
    const {
      fieldName,
      area,
      areaUnit,
      mainCrop,
      soilType,
    } = req.body;

    if (
      !fieldName ||
      !area ||
      !mainCrop ||
      !soilType
    ) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const farm = await Farm.create({
      farmerId: req.userId,
      fieldName,
      area,
      areaUnit,
      mainCrop,
      soilType,
    });

    res.status(201).json({
      message: "Farm added successfully!",
      farm,
    });

  } catch (error) {
    console.error("Create Farm Error:", error);

    res.status(500).json({
      message: "Server error while adding farm.",
    });
  }
};


// =====================================
// GET FARMS
// =====================================

const getFarms = async (req, res) => {
  try {

    const farms = await Farm.find({
      farmerId: req.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      farms,
    });

  } catch (error) {

    console.error("Get Farms Error:", error);

    res.status(500).json({
      message: "Server error while loading farms.",
    });
  }
};


// =====================================
// UPDATE FARM
// =====================================

const updateFarm = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      fieldName,
      area,
      areaUnit,
      mainCrop,
      soilType,
    } = req.body;

    const farm = await Farm.findOne({
      _id: id,
      farmerId: req.userId,
    });

    if (!farm) {
      return res.status(404).json({
        message: "Farm not found.",
      });
    }

    farm.fieldName = fieldName;
    farm.area = area;
    farm.areaUnit = areaUnit;
    farm.mainCrop = mainCrop;
    farm.soilType = soilType;

    await farm.save();

    res.status(200).json({
      message: "Farm updated successfully!",
      farm,
    });

  } catch (error) {

    console.error("Update Farm Error:", error);

    res.status(500).json({
      message: "Server error while updating farm.",
    });
  }
};


// =====================================
// DELETE FARM
// =====================================

const deleteFarm = async (req, res) => {
  try {

    const { id } = req.params;

    const farm = await Farm.findOneAndDelete({
      _id: id,
      farmerId: req.userId,
    });

    if (!farm) {
      return res.status(404).json({
        message: "Farm not found.",
      });
    }

    res.status(200).json({
      message: "Farm deleted successfully!",
    });

  } catch (error) {

    console.error("Delete Farm Error:", error);

    res.status(500).json({
      message: "Server error while deleting farm.",
    });
  }
};


module.exports = {
  createFarm,
  getFarms,
  updateFarm,
  deleteFarm,
};