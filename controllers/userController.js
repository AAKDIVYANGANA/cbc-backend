import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

// ================= SAVE USER =================
export async function saveUser(req, res) {
    try {
        const { email, password, firstName, lastName, role, phone } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        if (role === "admin") {
            if (!req.user || req.user.role !== "admin") {
                return res.status(403).json({ message: "Unauthorized to create admin account" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email: email.toLowerCase().trim(),
            firstname: firstName,
            lastname: lastName,
            password: hashedPassword,
            role: role || "user",
            phone: phone || "Not given",
            isDissabled: false,
            isEmailVerified: false,
        });

        await user.save();
        res.status(201).json({ message: "User saved successfully" });

    } catch (error) {
        console.error("❌ Save user error:", error);
        res.status(500).json({ message: "Error saving user", error: error.message });
    }
}

// ================= LOGIN USER =================
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (!process.env.JWT_KEY) {
            return res.status(500).json({ message: "Server configuration error: Missing JWT Key" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.isDissabled) {
            return res.status(403).json({ message: "Account is disabled" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const userData = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "24h" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                phone: user.phone,
            }
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

// ================= GOOGLE LOGIN =================
export async function googleLogin(req, res) {
    const accessToken = req.body.accessToken;

    if (!accessToken) {
        return res.status(400).json({ message: "Access token is required" });
    }

    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: "Bearer " + accessToken }
        });

        const googleUser = response.data;

        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            user = new User({
                email: googleUser.email,
                firstname: googleUser.given_name || "Google",
                lastname: googleUser.family_name || "User",
                password: await bcrypt.hash(googleUser.sub, 10),
                role: "user",
                phone: "Not given",
                isDissabled: false,
                isEmailVerified: true,
            });
            await user.save();
        }

        const userData = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "24h" });

        res.status(200).json({
            message: "Google login successful",
            token,
            user: {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("❌ Google login error:", error);
        res.status(500).json({ message: "Google login failed", error: error.message });
    }
}

// ================= GET CURRENT USER =================
export async function getCurrentUser(req, res) {
    if (req.user == null) {
        return res.status(403).json({ message: "Please login to get user details" });
    }
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            user: {
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                phone: user.phone,
            }
        });
    } catch (error) {
        console.error("❌ Get current user error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}