const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    address: String,
    father: String,
    mother: String,
    institution: String,
    qualification: String,
    hostel: String,
    sponsor: String,
    reports: [{type: mongoose.Schema.Types.ObjectId, ref:'report'}]
});

const Student = mongoose.model('students', studentSchema);

module.exports = Student;