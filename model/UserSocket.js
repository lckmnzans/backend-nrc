const mongoose = require('mongoose');

const UserSocketSchema = new mongoose.Schema({
    userId: { 
        type: String,
        required: true,
        unique: true
    },
    socketId: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('UserSocket', UserSocketSchema);