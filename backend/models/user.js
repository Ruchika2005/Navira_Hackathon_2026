const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },

    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^[6-9]\d{9}$/ // Indian mobile number
    },

    email: {
        type: String,
        lowercase: true,
        trim: true,
        sparse: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    language: {
        type: String,
        enum: ['english', 'hindi', 'marathi'],
        default: 'english'
    }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);