const express = require('express');
const router = express.Router();
const stuC = require('../controllers/stuControllers');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session.student) {
        return next();
    } else {
        res.redirect("/login");
    }
}

// Public Routes (Accessible without login)
router.get("/login", stuC.stulogin);
router.post("/login", stuC.handleLogin);
router.get("/register", stuC.studentinsertform);
router.post("/register", stuC.stuformdata);

// Protected Routes (Require Authentication)
router.get("/", isAuthenticated, stuC.stuhome);
router.get("/about", isAuthenticated, stuC.stuabout);
router.get("/contact", isAuthenticated, stuC.stucontact);
router.get("/profile", isAuthenticated, stuC.stuprofile);
router.get("/logout", stuC.stulogout);

// Student Management Routes
router.post("/student/update", isAuthenticated, stuC.stuupdate);
router.get("/student/delete/:id", isAuthenticated, stuC.studelete);

// Message Handling Route
router.post("/message", stuC.message);

module.exports = router;
