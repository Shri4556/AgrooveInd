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
// Update an advisory - Admin only
const updateAdvisory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      crop,
      soilType,
      title,
      description,
      sowing,
      irrigation,
      fertilizer,
      pestManagement,
      image,
    } = req.body;

    const advisory = await Advisory.findById(id);

    if (!advisory) {
      return res.status(404).json({
        message: "Advisory not found.",
      });
    }

    advisory.crop = crop ?? advisory.crop;
    advisory.soilType = soilType ?? advisory.soilType;
    advisory.title = title ?? advisory.title;
    advisory.description = description ?? advisory.description;
    advisory.sowing = sowing ?? advisory.sowing;
    advisory.irrigation = irrigation ?? advisory.irrigation;
    advisory.fertilizer = fertilizer ?? advisory.fertilizer;
    advisory.pestManagement =
      pestManagement ?? advisory.pestManagement;
    advisory.image = image ?? advisory.image;

    await advisory.save();

    res.status(200).json({
      message: "Advisory updated successfully.",
      advisory,
    });
  } catch (error) {
    console.error("Update Advisory Error:", error);

    res.status(500).json({
      message: "Server error while updating advisory.",
    });
  }
};
// Create a new advisory - Admin only
const createAdvisory = async (req, res) => {
  try {
    const {
      crop,
      soilType,
      title,
      description,
      sowing,
      irrigation,
      fertilizer,
      pestManagement,
      image,
    } = req.body;

    if (!crop || !soilType || !title || !description) {
      return res.status(400).json({
        message: "Crop, soil type, title and description are required.",
      });
    }

    const existingAdvisory = await Advisory.findOne({
      crop: { $regex: `^${crop}$`, $options: "i" },
      soilType: { $regex: `^${soilType}$`, $options: "i" },
    });

    if (existingAdvisory) {
      return res.status(409).json({
        message: "An advisory for this crop and soil type already exists.",
      });
    }

    const advisory = await Advisory.create({
      crop,
      soilType,
      title,
      description,
      sowing,
      irrigation,
      fertilizer,
      pestManagement,
      image,
    });

    return res.status(201).json({
      message: "Advisory created successfully.",
      advisory,
    });
  } catch (error) {
    console.error("Create Advisory Error:", error);

    return res.status(500).json({
      message: "Server error while creating advisory.",
    });
  }
};

module.exports = {
  getAdvisory,
  getAllAdvisories,
  updateAdvisory,
  createAdvisory,
};