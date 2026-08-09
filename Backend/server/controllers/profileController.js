const User = require("../models/User");

// =====================================
// GET PROFILE
// =====================================

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        res.status(500).json({
            message: "Server error while fetching profile."
        });
    }
};


// =====================================
// UPDATE PROFILE
// =====================================

const updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            gender,
            dob,
            state,
            district,
            village,
            pincode,
            farmSize,
            landUnit,
            soilType,
            mainCrop,
            irrigation,
            experience
        } = req.body;


        // Required fields
        if (
            !fullName ||
            !email ||
            !phone ||
            !state ||
            !district ||
            !village
        ) {
            return res.status(400).json({
                message: "Please fill all required fields."
            });
        }


        // Find logged-in user
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }


        // Check duplicate email
        const existingUser = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: req.userId }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered."
            });
        }


        // =====================================
        // Update Profile
        // =====================================

        user.fullName = fullName;
        user.email = email.toLowerCase();
        user.phone = phone;

        user.gender = gender || "";
        user.dob = dob || "";

        user.state = state;
        user.district = district;
        user.village = village;
        user.pincode = pincode || "";

        user.farmSize =
            farmSize === "" ? null : farmSize;

        user.landUnit = landUnit || "Acres";
        user.soilType = soilType || "";
        user.mainCrop = mainCrop || "";
        user.irrigation = irrigation || "";

        user.experience =
            experience === "" ? null : experience;


        await user.save();


        // Don't send password
        res.status(200).json({
            message: "Profile updated successfully!",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                gender: user.gender,
                dob: user.dob,
                state: user.state,
                district: user.district,
                village: user.village,
                pincode: user.pincode,
                farmSize: user.farmSize,
                landUnit: user.landUnit,
                soilType: user.soilType,
                mainCrop: user.mainCrop,
                irrigation: user.irrigation,
                experience: user.experience
            }
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        res.status(500).json({
            message: "Server error while updating profile."
        });
    }
};


module.exports = {
    getProfile,
    updateProfile
};