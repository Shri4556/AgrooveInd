const Advisory = require("../models/Advisory");

// =====================================
// Get advisory by crop and soil type
// =====================================

const getAdvisory = async (req, res) => {
  try {
    const { crop, soilType } = req.query;

    if (!crop || !soilType) {
      return res.status(400).json({
        message: "Crop and soil type are required.",
      });
    }

    const advisory = await Advisory.findOne({
      crop: { $regex: `^${crop}$`, $options: "i" },
      soilType: { $regex: `^${soilType}$`, $options: "i" },
    });

    if (!advisory) {
      return res.status(404).json({
        message: "No advisory found for this crop and soil type.",
      });
    }

    res.status(200).json({
      advisory,
    });
  } catch (error) {
    console.error("Get Advisory Error:", error);

    res.status(500).json({
      message: "Server error while fetching advisory.",
    });
  }
};

// =====================================
// Get all advisories
// =====================================

const getAllAdvisories = async (req, res) => {
  try {
    const advisories = await Advisory.find().sort({
      crop: 1,
      soilType: 1,
    });

    res.status(200).json({
      advisories,
    });
  } catch (error) {
    console.error("Get All Advisories Error:", error);

    res.status(500).json({
      message: "Server error while fetching advisories.",
    });
  }
};

module.exports = {
  getAdvisory,
  getAllAdvisories,
};