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
    filePath: {
        type: String,
        required: true
    },
    thumbnailPath: {
        type: String,
        required: false
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    uploader: { 
        type: schema.Types.ObjectId, 
        ref: 'user' 
    },
    deleted: {
        type: Boolean,
        required: false
    },
});

module.exports = File = mongoose.model("file", FileSchema);