const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/stu");

const router = express.Router();

// 🚀 GET: Registration Page
router.get("/register", (req, res) => {
    res.render("insertform", { errorMessage: null });
});

// 🚀 POST: Handle Student Registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, age, fees, password } = req.body;

        // ✅ Validation
        if (!name || !email || !age || !fees || !password) {
            return res.render("insertform", { errorMessage: "⚠️ All fields are required." });
        }

        // ✅ Check if Email Already Exists
        const existingUser = await User.findOne({ StuEmail: email });
        if (existingUser) {
            return res.render("insertform", {
                errorMessage: "⚠️ Email already registered. Please login."
            });
        }

        // ✅ Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create & Save User
        const newUser = new User({
            StuName: name,
            StuEmail: email,
            StuAge: age,
            StuFess: fees,
            password: hashedPassword
        });

        await newUser.save();

        // ✅ Flash Success (can also use session flash messages)
        res.render("login", { errorMessage: "✅ Registration successful. Please login." });

    } catch (error) {
        console.error("❌ Error during registration:", error);
        res.render("insertform", { errorMessage: "❌ Server error. Please try again later." });
    }
});

// 🚀 GET: Login Page
router.get("/login", (req, res) => {
    res.render("login", { errorMessage: null });
});

// 🚀 POST: Handle Login Logic
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Find user
        const user = await User.findOne({ StuEmail: email });
        if (!user) {
            return res.render("login", { errorMessage: "❌ Invalid email or password." });
        }

        // ✅ Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { errorMessage: "❌ Invalid email or password." });
        }

        // ✅ Set session
        req.session.user = {
            id: user._id,
            name: user.StuName,
            email: user.StuEmail
        };

        // ✅ Redirect to home/dashboard
        res.redirect("/");

    } catch (error) {
        console.error("❌ Login error:", error);
        res.render("login", { errorMessage: "❌ Server error. Please try again later." });
    }
});

// 🚀 GET: Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
