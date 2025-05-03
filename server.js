const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const frontendRoute = require("./router/frontendRoutes");
const authRoute = require("./router/authRoutes");
const adminRoutes = require('./router/admin');
const path = require("path");
require('dotenv').config();


const app = express();

// ✅ Fix: Proper Session Middleware
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1-hour session
}));

// ✅ Fix: Make session available in views
app.use((req, res, next) => {
    res.locals.admin = req.session.admin || false; // ✅ Now accessible in EJS
    next();
});

// ✅ Fix: Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // ✅ Ensure static files work
app.set("view engine", "ejs");

// ✅ Fix: Use Routes
app.use(frontendRoute);
app.use(authRoute);
app.use(adminRoutes);

// ✅ Fix: Proper Port Handling
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
