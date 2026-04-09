const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SIGNUP
exports.signup = async (req, res) => {
    try {
        const { userName, mobileNumber, email, password, confirmPassword, language } = req.body;

        // 1. Basic validation
        if (!userName || !mobileNumber || !password) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        // 2. Password match check
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // 3. Check existing mobile
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: "Mobile number already registered" });
        }

        // 4. Optional: Check existing email
        if (email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 6. Create user
        const user = await User.create({
            userName,
            mobileNumber,
            email,
            password: hashedPassword,
            language
        });

        // 7. Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 8. Send response
        res.status(201).json({
            message: "Signup successful",
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        // 1. Check user exists
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // 3. Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4. Send response
        res.json({
            message: "Login successful",
            token
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};