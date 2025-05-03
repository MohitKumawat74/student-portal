const Stu = require('../models/stu');
const Message = require('../models/message');
const bcrypt = require('bcrypt');

// Home Page
exports.stuhome = (req, res) => {
    res.render("homepage.ejs");
};

// About Page
exports.stuabout = (req, res) => {
    res.render("about.ejs");
};

// Contact Page
exports.stucontact = (req, res) => {
    res.render("contact.ejs");
};

// Render Insert Form
exports.studentinsertform = (req, res) => {
    res.render('register', { user: req.user, errorMessage: null }); 
};

exports.delete = async (req, res) => {
    try {
        const studentId = req.params.id;
        const deletedStudent = await Stu.findByIdAndDelete(studentId); // Use correct model name

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



// Handle Student Data Insertion
exports.stuformdata = async (req, res) => {
    try {
        const { name, email, age, fees, password } = req.body;

        if (!name || !email || !age || !fees || !password) {
            return res.render("register.ejs", { errorMessage: "All fields are required." });
        }

        // Check if student email already exists
        const existingStudent = await Stu.findOne({ StuEmail: email });
        if (existingStudent) {
            return res.render("register.ejs", { errorMessage: "Student with this email already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new student
        const record = new Stu({ 
            StuName: name, 
            StuAge: age, 
            StuEmail: email, 
            password: hashedPassword, 
            StuFess: fees 
        });

        await record.save();
        res.redirect("/login");
    } catch (error) {
        console.error("Error saving student record:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Fetch Students for Dashboard
exports.stuselection = async (req, res) => {
    try {
        const record = await Stu.find().sort({ StuName: 1 }); // Sorts A-Z
        res.render("dashboard.ejs", { record });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Delete Student
exports.studelete = async (req, res) => {
    try {
        await Stu.findByIdAndDelete(req.params.id);
        res.redirect("/selection");
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Update Student
exports.stuupdate = async (req, res) => {
    try {
        const { id, name, age, email, fees } = req.body;

        if (!id || !name || !email || !age || !fees) {
            return res.status(400).send("All fields are required.");
        }

        // Check if another student has the same email
        const existingStudent = await Stu.findOne({ StuEmail: email, _id: { $ne: id } });
        if (existingStudent) {
            return res.status(400).send("Another student with this email already exists.");
        }

        await Stu.findByIdAndUpdate(id, { 
            StuName: name, 
            StuAge: age, 
            StuEmail: email, 
            StuFess: fees 
        });

        res.redirect("/selection");
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).send("Internal Server Error");
    }
};


// Handle Message Submission
exports.message = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.render("message.ejs") &&  res.status(400).json({ success: false, message: "All fields are required." });
        }

        const newMessage = new Message({ name, email, message });
        await newMessage.save();

        res.status(201).json({ success: true, message: "Message saved successfully!" });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again later." });
    }

};


// Render Login Page
exports.stulogin = (req, res) => {
    res.render("login.ejs");
};



// Handle Student Login
exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login.ejs", { errorMessage: "Email and password are required." });
        }

        const student = await Stu.findOne({ StuEmail: email });

        if (!student) {
            return res.render("login.ejs", { errorMessage: "Invalid email or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.render("login.ejs", { errorMessage: "Invalid email or password." });
        }

        req.session.student = {
            id: student._id,
            name: student.StuName,
            email: student.StuEmail,
            age: student.StuAge
        };

        res.redirect("/profile");
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Profile Page Route
exports.stuprofile = (req, res) => {
    if (!req.session || !req.session.student) {
        return res.redirect("/login");
    }

    res.render("profile.ejs", { student: req.session.student });
};

// Logout Route
exports.stulogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};
