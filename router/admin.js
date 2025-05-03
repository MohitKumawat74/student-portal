const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers");

// Admin Routes
router.get("/admin", adminController.getAdminLogin);
router.post("/admin", adminController.postAdminLogin);
router.get("/dashboard", adminController.admindashboard);
router.get("/admin/logout", adminController.adminLogout);
router.delete("/delete/:id", adminController.deletedata); // Change POST to DELETE
router.post("/update", adminController.updateStudent);


module.exports = router;
