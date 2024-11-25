const mongoose = require('mongoose');
const schema = mongoose.Schema;

const DocumentSchema = new schema({
    kategori:{
        type:String,
        required:true
    },
    subkategori:{
        type:String,
        required:true
    },
    namaDokumen:{
        type:String,
        required:false
    },
    jenisDokumen:{
        type:String,
        required:false
    },
    instansiPenerbit:{
        type:String,
        required:false
    },
    nomorDokumen:{
        type:String,
        required:false
    },
    tanggalTerbit:{
        type:Date,
        required:false
    },
    masaBerlaku:{
        type:Date,
        required:false
    },
    keterangan:{
        type:schema.Types.Mixed,
        required:false
    }
});

const docTypeId = {
    'A01':'Legalitas',
    'A02':'Kontrak',
    'A03':'Tenaga Ahli',
    'A04':'CV',
    'A05':'Keuangan',
    'A06':'Proyek',
    'A07':'Pengurus',
    'A08':'Pemegang Saham',
    'A09':'Peralatan',
    'A10':'Lain-lain',
    'B01':'Surat Masuk',
    'B02':'Surat Keluar',
    'C01':'Sertifikat',
    'C02':'SPJB'
}

module.exports = Document = mongoose.model('document', DocumentSchema);