const File = require('../model/File');

const fileUpload = async function (filename, path) {
    const fileData = new File({
        filename: filename,
        path: path
    });
    const savedFile = await fileData.save();
    return savedFile;
}

const fileDownload = async function (filename, next) {
    try {
        const savedFile = await File.findOne({ filename: filename });
        return file;
    } catch (error) {
        throw new Error('Failed to retrieve the document');
    }
}

const getDocumentData = function (docTypeId, body) {
    let data = new Object();
    return;
}

module.exports = { fileUpload, fileDownload };