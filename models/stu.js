const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    StuName: String,
    StuEmail: { type: String, unique: true, required: true },
    StuAge: Number,
    StuFess: Number,
    password: { type: String, required: true } // Encrypted Password
});

module.exports = mongoose.model('Stu', StudentSchema);
