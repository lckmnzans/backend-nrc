const express = require('express');
const router = express.Router();
const passport = require('passport');
const Document = require('../model/Document');

const { A01Doc, A02Doc, A03Doc, A04Doc, A05Doc, A06Doc, A07Doc, A08Doc, A09Doc, A10Doc, B01Doc, B02Doc, C01Doc, C02Doc, BaseModel } = require('../model/Document');
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

async function saveDocData(req,res) {
    const { docType } = req.params;
    const rawDocument = req.body;
    const Model = modelMap[docType];
    if (!Model) {
        return res.status(400).json({
            success: false,
            message: 'Tipe dokumen tidak ditemukan.'
        })
    }

    try {
        const mapDocument = new Model(rawDocument);
        await mapDocument.save();

        return res.json({
            success: true,
            message: 'Dokumen berhasil disimpan.',
            data: mapDocument
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Gagal menyimpan dokumen. Error: ' + err.message
        })
    }
}

async function getDocument(req,res) {
    const { docId } = req.params;
    BaseModel.findById(docId)
    .then(doc => {
        if (!doc) {
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan.'
            })
        } else {
            return res.json({
                success: true,
                message: 'Dokumen berhasil diambil.',
                data: doc
            })
        }
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil dokumen. Error: ' + err.message
        })
    })
}

async function updateDocData(req,res) {
    const { docType, docId } = req.params;
    const updateData = req.body;
    const Model = modelMap[docType];

    if (!Model) {
        return res.status(400).json({
            success: false,
            message: 'docType tidak ada kecocokan di database.'
        });
    }

    try {
        const existingDocument = await Model.findById(docId);
        if (!existingDocument) {
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan.'
            })
        }

        Object.assign(existingDocument, updateData);
        await existingDocument.save();

        return res.json({
            success: true,
            message: 'Dokumen berhasil diperbarui.',
            data: existingDocument
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui dokumen. Error: ' + err.message
        })
    }
}

module.exports = { saveDocData, getDocument, updateDocData };