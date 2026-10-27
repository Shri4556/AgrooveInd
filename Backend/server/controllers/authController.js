const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({
                message: "Please fill all fields."
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: "farmer"
        });

        res.status(201).json({
            message: "Account created successfully!",
            userId: user._id
        });

    } catch (error) {
        console.error("Signup Error:", error);

        res.status(500).json({
            message: "Server error during signup."
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        let role = "farmer";
        if (
            process.env.ADMIN_EMAIL &&
         user.email.trim().toLowerCase() ===
        process.env.ADMIN_EMAIL.trim().toLowerCase()
          ) {
             role = "admin";
             await user.save();
              }

         const token = jwt.sign(
         {
          userId: user._id,
          userRole: role,
          },
         process.env.JWT_SECRET,
          { expiresIn: "1d" }
         );

        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: role,
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error during login."
        });
    }
};

module.exports = {
    signup,
    login
};