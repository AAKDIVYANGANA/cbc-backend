import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// ================= SAVE USER =================
export async function saveUser(req, res) {
    try {
        const { email, password, firstName, lastName, role, phone } = req.body;

        // 1. Check required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // 3. Protect admin role creation
        if (role === "admin") {
            if (!req.user || req.user.role !== "admin") {
                return res.status(403).json({ message: "Unauthorized to create admin account" });
            }
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Create and save user
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
        console.log("✅ Login route hit!");
        console.log("📦 Body received:", req.body);

        const { email, password } = req.body;

        // 1. Check if input exists
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Check JWT_KEY first
        if (!process.env.JWT_KEY) {
            console.error("❌ ERROR: JWT_KEY is missing in .env file!");
            return res.status(500).json({ message: "Server configuration error: Missing JWT Key" });
        }

        // 3. Find user in database
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        console.log("🔍 User found:", user);

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 4. Check if account is disabled
        if (user.isDissabled) {
            return res.status(403).json({ message: "Account is disabled" });
        }

        // 5. Check password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 6. Sign JWT
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