const File = require('../model/File');
const { A01Doc, A02Doc, A03Doc, A04Doc, A05Doc, A06Doc, A07Doc, A08Doc, A09Doc, A10Doc, B01Doc, B02Doc, C01Doc, C02Doc, docTypes } = require('../model/Document');
const modelMap = {
    A01: A01Doc,
    A02: A02Doc,
    A03: A03Doc,
    A04: A04Doc,
    A05: A05Doc,
    A06: A06Doc,
    A07: A07Doc,
    A08: A08Doc,
    A09: A09Doc,
    A10: A10Doc,
    B01: B01Doc,
    B02: B02Doc,
    C01: C01Doc,
    C02: C02Doc
}

const getDocTypeById = function (docTypeId) {
    const docTypeObj = docTypes.find(docType => docType.docTypeId === docTypeId);
    return docTypeObj ? docTypeObj.docTypeName : null;
}

const getDocTypeByName = function (docTypeName) {
    const docTypeObj = docTypes.find(docType => docType.docTypeName === docTypeName);
    return docTypeObj ? docTypeObj.docTypeId : null;
}

async function ocrResultModelMapper(docType, docId, data) {
    let rawData;
    switch (docType) {
        case 'A01':
            rawData = ocrA01(data);
            break;
        case 'A02':
            rawData = ocrA02(data);
            break;
        case 'A03':
            rawData = ocrA03(data);
            break;
        case 'A04':
            rawData = ocrA04(data);
            break;
        case 'A05':
            rawData = ocrA05(data);
            break;
        case 'A06':
            rawData=null;
            break;
        case 'A07':
            rawData=null;
            break;
        case 'A08':
            rawData=null;
            break;
        case 'A09':
            rawData=null;
            break;
        case 'A10':
            rawData=null;
            break;
        case 'B01':
            rawData = ocrB01(data);
            break;
        case 'B02':
            rawData = ocrB02(data);
            break;
        case 'C01':
            rawData=null;
            break;
        case 'C02':
            rawData=null;
            break;
        default:
            console.log(`Unsupported document type: ${docType}`);
            rawData=null;
            break;
    }
    if (rawData) {
        rawData['hasPassedScreening'] = true;
        await _updateDocument(docType, docId, rawData);
    }
}

const ocrA01 = (data) => {
    return {
        'masaBerlaku': data.masa_berlaku,
        'tglTerbit': reformatDate(data.tanggal_terbit),
        'instansiPenerbit': data.penerbit,
        'noDokumen': data.nomor_dokumen
    }
}

const ocrA02 = (data) => {
    return {
        'namaKontrak': data.nama_proyek,
        'noProyek': data.nomor_kontrak,
        'pemberiKerja': data.pemberi_kerja,
        'tglKontrak': reformatDate(data.tanggal)
    }
}

const ocrA03 = (data) => {
    return {
        'tglTerbit': reformatDate(data.terbit_date),
        'masaBerlaku': reformatDate(data.validity),
        'nama': data.nama,
        'noSertifikat': data.certificate_number,
        'jenisSertifikatKeahlian': data.competency,
    }
}

const ocrA04 = (data) => {
    const latestExperience = data.latest_experience;
    const latestEducation = data.education[data.education.length - 1];
    return {
        'nama': data.nama,
        'alamatKtp': data.alamat,
        'noHp': data.telpon,
        'ttl': data.ttl,
        'pendidikanTerakhir': latestEducation.degree,
        'instansiPendidikan': latestEducation.institution,
        'tahunLulus': latestEducation.graduation_year,
        'pengalamanKerja': latestExperience.start_date + '-' + latestExperience.end_date,
        'proyekTerakhir': latestExperience.project,
        'jabatan': latestExperience.role
    }
}

const ocrA05 = (data) => {
    return {
        'noLaporan': data.nomor,
        'tglLaporan': reformatDate(data.tanggal),
        'periode': data.tahun,
    }
}

const ocrB01 = (data) => {
    return {
        'pengirim': data.pengirim,
        'noSurat': data.nomor,
        'tglTerbit': reformatDate(data.tanggal),
        'perihal': data.perihal
    }
}

const ocrB02 = (data) => {
    return {
        'noSurat': data.nomor,
        'tglTerbit': reformatDate(data.tanggal),
        'perihal': data.perihal
    }
}

async function _updateDocument(docType, docId, newData) {
    const Model = modelMap[docType];
    try {
        const existingDocument = await Model.findById(docId);
        if (existingDocument) {
            for (const key in newData) {
                if (Object.hasOwnProperty.call(newData, key)) {
                    if (!existingDocument[key] || existingDocument[key] === '') {
                        existingDocument[key] = newData[key];
                    }
                }
            }

            await existingDocument.save();
            console.log('Document updated successfully');
        } else {
            console.log('Document is not exists');
        }
    } catch (err) {
        console.log(err);
    } finally {
        return;
    }
}

const reformatDate = (inputDate) => {
    if (inputDate == 'N/A') {
        return "N/A";
    } 
    const [day, month, year] = inputDate.split("-");
    return `${year}-${month}-${day}`;
}

module.exports = { modelMap, getDocTypeById, getDocTypeByName, ocrResultModelMapper };