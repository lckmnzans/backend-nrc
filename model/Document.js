const mongoose = require('mongoose');
const schema = mongoose.Schema;

const DocumentSchema = new schema({
    namaDokumen:{
        type:String,
        required:true
    },
    jenisDokumen:{
        type:String,
        required:true
    },
    instansiPenerbit:{
        type:String,
        required:true
    },
    nomorDokumen:{
        type:String,
        required:true
    },
    tanggalTerbit:{
        type:Date,
        required:true
    },
    masaBerlaku:{
        type:Date,
        required:true
    },
    keterangan:{
        type:schema.Types.Mixed,
        required:false
    }
});

module.exports = Document = mongoose.model('document', DocumentSchema);