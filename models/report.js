const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    text: String,
    createdAt: {type:Date, default: Date.now}
});

const Report = mongoose.model('reports', reportSchema);

module.exports = Report;