const { modelMap, docTypes } = require('../model/Document');

class DocumentService {
    constructor() {
        this.modelMap = modelMap;
    }

    async getDocumentById(docId, docType) {
        const model = this.modelMap[docType];
        const document = await model.findById(docId);
        return document;
    }

    getDocTypeById(docTypeId) {
        const docTypeObj = docTypes.find(docType => docType.docTypeId === docTypeId);
        return docTypeObj ? docTypeObj.docTypeName : null;
    }

    getDocTypeByName(docTypeName) {
        const docTypeObj = docTypes.find(docType => docType.docTypeName === docTypeName);
        return docTypeObj ? docTypeObj.docTypeId : null;
    }

    async ocrResultModelMapper(docType, docId, data) {
        const ocrMethod = this[`_ocr${docType}`];
        if (!ocrMethod) {
            console.log(`No OCR method found for docType: ${docType}`);
            return;
        }

        const rawData = ocrMethod(data);
        if (rawData) {
            rawData['hasPassedScreening'] = true;
            await this._updateDocument(docType, docId, rawData);
        }
    }

    _reformatDate(inputDate) {
        if (inputDate) {
            if (inputDate != 'N/A') {
                try {
                    const [day, month, year] = inputDate.split("-");
                    return `${year}-${month}-${day}`;
                } catch(err) {
                    console.log(err);
                }
            }
        }
        return 'N/A';
    }

    _ocrA01 = (data) => {
        return {
            'masaBerlaku': data['masa_berlaku'],
            'tglTerbit': this._reformatDate(data['tanggal_terbit']),
            'instansiPenerbit': data['penerbit'],
            'noDokumen': data['nomor_dokumen']
        };
    }

    _ocrA02 = (data) => {
        return {
            'namaKontrak': data['nama_proyek'],
            'noKontrak': data['nomor_kontrak'],
            'pemberiKerja': data['pemberi_kerja'],
            'tglKontrak': this._reformatDate(data['tanggal'])
        };
    }

    _ocrA03 = (data) => {
        return {
            'tglTerbit': this._reformatDate(data['terbit_date']),
            'masaBerlaku': this._reformatDate(data['validity']),
            'nama': data['nama'],
            'noSertifikat': data['certificate_number'],
            'jenisSertifikatKeahlian': data['competency'],
        };
    }

    _ocrA04 = (data) => {
        const latestExperience = data['latest_experience'];
        const latestEducation = data['education'] ? data['education'][data['education'].length - 1] : null;
        return {
            'nama': data['nama'],
            'alamatKtp': data['alamat'],
            'noHp': data['telpon'],
            'ttl': data['ttl'],
            'pendidikanTerakhir': latestEducation ? latestEducation['degree'] : 'N/A',
            'instansiPendidikan': latestEducation ? latestEducation['institution'] : 'N/A',
            'tahunLulus': latestEducation ? latestEducation['graduation_year'] : 'N/A',
            'pengalamanKerja': latestExperience ? `${latestExperience['start_date']}-${latestExperience['end_date']}` : 'N/A',
            'proyekTerakhir': latestExperience ? latestExperience['project'] : 'N/A',
            'jabatan': latestExperience ? latestExperience['role'] : 'N/A'
        };
    }

    _ocrA05 = (data) => {
        return {
            'noLaporan': data['nomor'],
            'tglLaporan': this._reformatDate(data['tanggal']),
            'periode': data['tahun'],
        };
    }

    _ocrA07 = (data) => {
        return {
            'nama': data['nama']
        }
    }

    _ocrA08 = (data) => {
        return {
            'nama': data['nama']
        }
    }

    _ocrB01 = (data) => {
        return {
            'pengirim': data['pengirim'],
            'noSurat': data['nomor'],
            'tglTerbit': this._reformatDate(data['tanggal']),
            'perihal': data['perihal']
        };
    }

    _ocrB02 = (data) => {
        return {
            'noSurat': data['nomor'],
            'tglTerbit': this._reformatDate(data['tanggal']),
            'perihal': data['perihal']
        };
    }

    async _updateDocument(docType, docId, newData) {
        const Model = this.modelMap[docType];
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
                console.log(`Dokumen ${docId} berhasil diperbarui dengan hasil OCR`);
            } else {
                console.log(`Dokumen ${docId} tidak ditemukan`);
            }
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = new DocumentService();