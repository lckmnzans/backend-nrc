const express = require('express');
const router = express.Router();
const passport = require('passport');
const Document = require('../model/Document');

const { A01Doc, A02Doc, A03Doc, A04Doc, A05Doc, A06Doc, A07Doc, A08Doc, A09Doc, A10Doc, B01Doc, B02Doc, C01Doc, C02Doc } = require('../model/Document');
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

async function saveOcr(req,res) {
    try {
        const { 
            namaDokumen,
            jenisDokumen,
            instansiPenerbit,
            nomorDokumen,
            tanggalTerbit,
            masaBerlaku,
            keterangan,
        } = req.body;
        if (
            !namaDokumen ||
            !jenisDokumen ||
            !instansiPenerbit ||
            !nomorDokumen ||
            !tanggalTerbit ||
            !masaBerlaku
        ) {
            return res.status(400).json({ 
                success: false,
                message: 'Semua field wajib diisi.'
            });
        }

        tanggalTerbit = new Date(tanggalTerbit);
        masaBerlaku = new Date(masaBerlaku);
        if (isNaN(tanggalTerbit) || isNaN(masaBerlaku)) {
            return res.status(400).json({ 
                success: false,
                message: 'Format tanggal tidak valid.'
            })
        }

        const newDocument = new Document({
            namaDokumen,
            jenisDokumen,
            instansiPenerbit,
            nomorDokumen,
            tanggalTerbit,
            masaBerlaku,
            keterangan,
        });
        const savedDocument = await newDocument.save();
        return res.status(201).json({
            success: true,
            message: 'Dokumen berhasil disimpan.',
            data: { savedDocument },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
}

async function getListOfDocumentsFilter(req,res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {};
    if (req.query.namaDokumen) filters.namaDokumen = req.query.namaDokumen;
    if (req.query.jenisDokumen) filters.jenisDokumen = req.query.jenisDokumen;
    if (req.query.instansiPenerbit) filters.instansiPenerbit = req.query.instansiPenerbit;
    if (req.query.nomorDokumen) filters.nomorDokumen = req.query.nomorDokumen;
    if (req.query.tanggalTerbit) filters.tanggalTerbit = new Date(req.query.tanggalTerbit);
    if (req.query.masaBerlaku) filters.masaBerlaku = new Date(req.query.masaBerlaku);

    const startIndex = (page - 1) * limit;
    const total = await Document.countDocuments(filters);
    const documents = await Document.find(filters).skip(startIndex).limit(limit);

    return res.json({
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: documents
    });
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

module.exports = { saveOcr, getListOfDocumentsFilter, saveDocData };