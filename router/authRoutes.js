const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/stu");

const router = express.Router();

// Registration Route
router.get("/register", (req, res) => {
    res.render("insertform", { errorMessage: null });
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, age, fees, password } = req.body;

        if (!name || !email || !age || !fees || !password) {
            return res.render("insertform", { errorMessage: "All fields are required." });
        }

        const existingUser = await User.findOne({ StuEmail: email });
        if (existingUser) {
            return res.render("insertform", { errorMessage: "Email already exists. Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            StuName: name,
            StuEmail: email,
            StuAge: age,
            StuFess: fees,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.redirect("/register");
    }
});

// Login Route
router.get("/login", (req, res) => {
    res.render("login", { errorMessage: null });
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ StuEmail: email });
        if (!user) {
            return res.render("login", { errorMessage: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { errorMessage: "Invalid email or password." });
        }

        req.session.user = {
            id: user._id,
            name: user.StuName,
            email: user.StuEmail
        };

        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.redirect("/login");
    }
});

// Logout Route
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
