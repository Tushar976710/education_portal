const asyncHandler = require("express-async-handler");
const { uploadGallery, uploadProfile } = require("../utils/upload");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modal/User");

exports.register = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // if (!name || !email || !password) {
        //     return res.status(400).json({ message: "Please provide name, email, and password." });
        // }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Email is not valid." });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Please enter a strong password." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // uploadProfile(req, res, async (err) => {
        //     if (err) {
        //         return res.status(400).json({ message: err.message || "Unable to upload profile picture." });
        //     }
        //     console.log(req.file);
        //     if (req.file) {
        //         await User.create({ name, avatar: req.file.filename, password: hashedPassword });
        //     }
        //     res.status(201).json({ message: "User created successfully." });
        // });
        await User.create({ name, avatar: req.file.filename, password: hashedPassword, email });
    } catch (error) {
        console.error("Error in register function:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if email is valid
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email is not valid." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Email is not registered." });
    }

    // Check if user account is active
    if (user.active) {
        return res.status(400).json({ message: "Your account is blocked. Please contact support." });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect password." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });

    // Set JWT token as a cookie
    res.cookie("devAuth", token, { maxAge: 1000 * 60 * 60 * 4 }); // 4 hours expiry

    // Respond with user information
    res.status(200).json({
        message: "Login successful.",
        result: {
            name: user.name,
            email: user.email,
        }
    });
});

exports.logout = asyncHandler(async (req, res) => {
    // Clear JWT token cookie
    res.clearCookie("devAuth");
    res.status(200).json({ message: "Logout successful." });
});
