const Admin = require("../models/admindata");
const Student = require("../models/stu"); // Assuming you have a Student model
const express = require("express");
const router = express.Router();

// ✅ Render Admin Login Page
exports.getAdminLogin = (req, res) => {
    if (req.session.admin) {
        return res.redirect("/dashboard",);
    }
    res.render("admin", { errorMessage: null });
};

// ✅ Handle Admin Login
exports.postAdminLogin = (req, res) => {
    const { email, password } = req.body;

    // Check fixed credentials
    if (email === "mohitkumawat5353@gmail.com" && password === "888mohit") {
        req.session.admin = true; // Store session to maintain login
        return res.redirect("/dashboard");
    } else {
        return res.render("admin", { errorMessage: "Invalid email or password!" });
    }
};

// ✅ Render Admin Dashboard
exports.admindashboard = async (req, res) => {
    if (!req.session.admin) {
        return res.redirect("/admin");
    }

    try {
        const records = await Student.find().sort({ StuName: 1 }); // Sort by name (ascending)
        res.render("dashboard", { records });
    } catch (error) {
        console.error("Error fetching student records:", error);
        res.render("dashboard", { records: [] });
    }
};

// ✅ Handle Admin Logout
exports.adminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout Error:", err);
        }
        res.redirect("/admin");
    });
};

// Alternative if DELETE requests aren't working:
exports.deletedata = async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Student deleted successfully!" }); // Send JSON response
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Error deleting student" });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { id, name, age, email, fees } = req.body;

        await Student.findByIdAndUpdate(id, {
            StuName: name,
            StuAge: age,
            StuEmail: email,
            StuFess: fees,
        });

        res.redirect("/dashboard"); // Redirect to dashboard after update
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).send("Error updating student");
    }
};
