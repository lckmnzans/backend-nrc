const mongoose = require('mongoose');
const schema = mongoose.Schema;

const FileSchema = new schema({
    filename: {
        type: String,
        required: true
    },
    documentType: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: false
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = File = mongoose.model("file", FileSchema);