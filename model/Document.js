const mongoose = require('mongoose');
const schema = mongoose.Schema;

const baseSchema = new schema({
    docName: {
        type: String,
        required: true
    },
    docType: {
        type: String,
        required: true
    },
    fileRef: { 
        type: schema.Types.ObjectId, 
        ref: 'file' 
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    verificationStatus: {
        type: String,
        enum: ['unverified','verified'],
        required: true,
        default: 'unverified'
    },
    hasPassedScreening: {
        type: Boolean,
        required: true,
        default: false
    },
    notes: {
        type: String,
        required: false
    }
}, { discriminatorKey: 'docType', collection: 'documents' });

const BaseModel = mongoose.model('Base', baseSchema);

const A01Doc = BaseModel.discriminator('A01', new schema({
    namaDokumen: {
        type: String,
        required: false
    },
    instansiPenerbit: {
        type: String,
        required: false,
    },
    noDokumen: {
        type: String,
        required: false,
    },
    tglTerbit: {
        type: String,
        required: false,
    },
    masaBerlaku: {
        type: String,
        required: false
    }
}));

const A02Doc = BaseModel.discriminator('A02', new schema({
    namaKontrak: {
        type: String,
        required: false
    },
    noProyek: {
        type: String,
        required: false
    },
    tglKontrak: {
        type: String,
        required: false
    },
    noKontrak: {
        type: String,
        required: false
    },
    pemberiKerja: {
        type: String,
        required: false
    },
    jenisDokumen: {
        type: String,
        required: false
    }
}));

const A03Doc = BaseModel.discriminator('A03', new schema({
    nama: {
        type: String,
        required: false
    },
    noSertifikat: {
        type: String,
        required: false
    },
    tglTerbit: {
        type: String,
        required: false
    },
    masaBerlaku: {
        type: String,
        required: false
    },
    jenisSertifikatKeahlian: {
        type: String,
        required: false
    },
    jabatan: {
        type: String,
        required: false
    }
}));

const A04Doc = BaseModel.discriminator('A04', new schema({
    nama: {
        type: String,
        required: false
    },
    noDokumen: {
        type: String,
        required: false
    },
    jabatan: {
        type: String,
        required: false
    },
    ttl: {
        type: String,
        required: false
    },
    pendidikanTerakhir: {
        type: String,
        required: false
    },
    instansiPendidikan: {
        type: String,
        required: false
    },
    tahunLulus: {
        type: String,
        required: false
    },
    pengalamanKerja: {
        type: String,
        required: false
    },
    proyekTerakhir: {
        type: String,
        required: false
    },
    alamatKtp: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    noHp: {
        type: String,
        required: false
    },
    noNPWP: {
        type: String,
        required: false
    }
}));

const A05Doc = BaseModel.discriminator('A05', new schema({
    namaDokumen: {
        type: String,
        required: false
    },
    noLaporan: {
        type: String,
        required: false
    },
    tglLaporan: {
        type: Date,
        required: false
    },
    periode: {
        type: String,
        required: false
    }
}));

const A06Doc = BaseModel.discriminator('A06', new schema({
    namaProyek: {
        type: String,
        required: false
    }
}));

const A07Doc = BaseModel.discriminator('A07', new schema({
    nama: {
        type: String,
        required: false
    },
    jabatan: {
        type: String,
        required: false
    },
    diangkatBerdasarkanAkta: {
        type: String,
        required: false
    }
}));

const A08Doc = BaseModel.discriminator('A08', new schema({
    nama: {
        type: String,
        required: false
    },
    jmlSaham: {
        type: Number,
        required: false
    },
    nilaiSaham: {
        type: Number,
        required: false
    },
    presentase: {
        type: Number,
        required: false
    }
}));

const A09Doc = BaseModel.discriminator('A09', new schema({
    noDokumen: {
        type: String,
        required: false
    }
}));

const A10Doc = BaseModel.discriminator('A10', new schema({
    namaDokumen: {
        type: String,
        required: false
    },
    instansiPenerbit: {
        type: String,
        required: false
    },
    noDokumen: {
        type: String,
        required: false
    },
    tglTerbit: {
        type: String,
        required: false
    }
}));

const B01Doc = BaseModel.discriminator('B01', new schema({
    pengirim:{
        type: String,
        required: false
    },
    noSurat: {
        type: String,
        required: false
    },
    tglTerbit: {
        type: String,
        required: false
    },
    perihal: {
        type: String,
        required: false
    }
}));

const B02Doc = BaseModel.discriminator('B02', new schema({
    noSurat: {
        type: String,
        required: false
    },
    tglTerbit: {
        type: String,
        required: false
    },
    perihal: {
        type: String,
        required: false
    },
    drafter: {
        type: String,
        required: false
    },
    tujuanSurat: {
        type: String,
        required: false
    }
}));

const C01Doc = BaseModel.discriminator('C01', new schema({
    noSertifikat:{
        type: String,
        required: false
    },
    tglTerbit:{
        type: String,
        required: false
    },
    masaBerlaku:{
        type: String,
        required: false
    },
    jenisSertifikat:{
        type: String,
        required: false
    },
    lokasi:{
        type: String,
        required: false
    },
    luas:{
        type: String,
        required: false
    }
}));

const C02Doc = BaseModel.discriminator('C02', new schema({
    namaPic:{
        type: String,
        required: false
    },
    namaPtPenjual:{
        type: String,
        required: false
    },
    noPPJB:{
        type: String,
        required: false
    },
    tglPPJB:{
        type: String,
        required: false
    },
    lokasi:{
        type: String,
        required: false
    },
    luas:{
        type: String,
        required: false
    }
}));

const modelMap = {
    A01: A01Doc, A02: A02Doc, A03: A03Doc, A04: A04Doc, A05: A05Doc,
    A06: A06Doc, A07: A07Doc, A08: A08Doc, A09: A09Doc, A10: A10Doc,
    B01: B01Doc, B02: B02Doc, C01: C01Doc, C02: C02Doc
};

const docTypes = [
    {   'docTypeId':'A01',
        'docTypeLabel':'Legalitas',
        'docTypeName':'legalitas'
    },
    {   'docTypeId':'A02',
        'docTypeLabel':'Kontrak',
        'docTypeName':'kontrak'
    },
    {   'docTypeId':'A03',
        'docTypeLabel':'Tenaga Ahli',
        'docTypeName':'tenaga_ahli'
    },
    {   'docTypeId':'A04',
        'docTypeLabel':'CV',
        'docTypeName':'cv'
    },
    {   'docTypeId':'A05',
        'docTypeLabel':'Keuangan',
        'docTypeName':'keuangan'
    },
    {   'docTypeId':'A06',
        'docTypeLabel':'Proyek',
        'docTypeName':'proyek'
    },
    {   'docTypeId':'A07',
        'docTypeLabel':'Pengurus',
        'docTypeName':'pengurus'
    },
    {   'docTypeId':'A08',
        'docTypeLabel':'Pemegang Saham',
        'docTypeName':'pemegang_saham'
    },
    {   'docTypeId':'A09',
        'docTypeLabel':'Peralatan',
        'docTypeName':'peralatan'
    },
    {   'docTypeId':'A10',
        'docTypeLabel':'Lain-lain',
        'docTypeName':'lain_lain'
    },
    {   'docTypeId':'B01',
        'docTypeLabel':'Surat Masuk',
        'docTypeName':'surat_masuk'
    },
    {   'docTypeId':'B02',
        'docTypeLabel':'Surat Keluar',
        'docTypeName':'surat_keluar'
    },
    {   'docTypeId':'C01',
        'docTypeLabel':'Sertifikat',
        'docTypeName':'sertifikat'
    },
    {   'docTypeId':'C02',
        'docTypeLabel':'SPJB',
        'docTypeName':'spjb'
    }
]

module.exports = { BaseModel, modelMap, docTypes };