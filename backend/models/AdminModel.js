const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin'
    }
});

module.exports = mongoose.model('Admin', adminSchema);