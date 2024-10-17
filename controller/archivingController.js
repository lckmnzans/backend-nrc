const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/ocr', async (req,res) => {
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
            return res.status(400).json({ message: 'Semua field wajib diisi.' });
        }

        tanggalTerbit = new Date(tanggalTerbit);
        masaBerlaku = new Date(masaBerlaku);
        if (isNaN(tanggalTerbit) || isNaN(masaBerlaku)) {
            return res.status(400).json({ message: 'Format tanggal tidak valid.'})
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
        res.status(201).json({
            success: true,
            message: 'Dokumen berhasil disimpan.',
            data: savedDocument,
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Terjadi kesalahan.'
        });
    }
});