# API Archiving

Backend untuk Aplikasi Arsip Digital dengan express dan mongo.

## Daftar Isi
- [Instruksi](#instruksi)
- [API Documentation](#api-documentation)
  - [Accounts Endpoint](#account-endpoints)
    - [Register Akun](#1-register-akun)
    - [Login](#2-login)
    - [Detail Akun](#3-detail-akun)
    - [Ganti Password](#4-ganti-password)
    - [Permintaan Reset Password](#5-permintaan-reset-password)
    - [Menyetujui Permintaan Reset Password](#6-menyetujui-permintaan-reset-password)
    - [Buat Password Baru(Reset Password)](#7-buat-password-baru-reset-password)
    - [List Accounts](#9-list-accounts)
  - [Documents Endpoint](#document-endpoints)
    - [Mengunggah Dokumen PDF](#1-unggah-dokumen-pdf)
    - [Mengunggah Data Dokumen](#2-unggah-data-dokumen)
    - [Mengunduh Dokumen PDF](#3-mengunduh-dokumen-pdf)
    - [Mendapatkan Data Dokumen](#4-mendapatkan-data-dokumen)

## Instruksi
Diperlukan dependensi berikut
- mongodb 8.x
- nodejs 10.x

#### Clone repositori ini
```bash
git clone https://github.com/lckmnzans/backend-nrc.git
```

#### Masuk ke direktori proyek
```bash
cd backend-nrc
```

#### Install dependensi proyek
```bash
npm install
```

#### Install dependensi global jika belum ada
```bash
npm install -g dotenv
```

#### Buat file .env di direktori dengan isian seperti contoh berikut
```bash
SERVER_HOSTNAME="localhost"
SERVER_PORT=8000
MONGODB_URI="mongodb://127.0.0.1:27017"
VUE_URI="http://localhost:8080"
FILE_STORAGE_PATH=/mnt/d/documents
SMTP_USER="furqon@nusarayacipta.com"
SMTP_PASS="Furq0n.nrc"
OCR_HOST="http://localhost:5000"
NLP_HOST="http://localhost:6000"
BROKERS=localhost:9092
```

#### Jalankan server
```bash
npm run dev
```
<br>
<br>

# API Documentation

## Account Endpoints

### **1. Register Akun**
**Endpoint:** `POST /api/v1/account/register`

**Deskripsi:**
- Mendaftarkan akun baru
- Hanya bisa diakses oleh pengguna dengan role **superadmin**

**Headers:**
```json
Authorization: Bearer <token>
```

**Body (application/json):**
```json
{
    "username": "username",
    "email": "email@mail.com",
    "role": "admin",
    "password": "user123",
    "password2": "user123"
}
```

---
### **2. Login**
**Endpoint:** `POST /api/v1/account/login`

**Deskripsi:**
- Melakukan login akun

**Body (application/x-www-form-urlencoded):**
```
username: <username akun>
password: <password akun>
```

---
### **3. Detail Akun**
**Endpoint:** `GET /api/v1/account/:id`

**Deskripsi:**
- Mengambil detail akun berdasarkan ID

**Headers:**
```json
Authorization: Bearer <token>
```

**Path Variables:**
```
id: <id akun user>
```

---

### **4. Ganti Password**
**Endpoint:** `PATCH /api/v1/account/:id?requestChange=pass`

**Deskripsi:**
- Mengubah password lama ke password baru

**Headers:**
```json
Authorization: Bearer <token>
```

**Path Variables:**
```
id: <id akun user>
```

**Body (application/json):**
```json
{
    "username": "user0",
    "oldPassword": "admin123",
    "newPassword": "password123"
}
```

---
### **5. Permintaan Reset Password**
**Endpoint:** `POST /api/v1/account/request-reset`

**Deskripsi:**
- Meminta reset password

**Body (application/json):**
```json
{
    "username": "user0",
    "email": "testing0@mail.com"
}
```

---

### **6. Menyetujui Permintaan Reset Password**
**Endpoint:** `POST /api/v1/account/approve-reset/:id`

**Deskripsi:**
- Menyetujui permintaan reset password
- Hanya bisa diakses oleh **superadmin**

**Headers:**
```json
Authorization: Bearer <token>
```

**Path Variables:**
```
id: <id akun user>
```

**Body (application/json):**
```json
{
    "username": "user",
    "email": "email@mail.com"
}
```

---

### **7. Buat Password Baru (Reset Password)**
**Endpoint:** `POST /api/v1/account/reset-pass?token=<token>`

**Deskripsi:**
- Mengatur password baru setelah reset

**Query Params:**
```json
{
    "token": "<token>"
}
```

**Body (application/json):**
```json
{
    "otp": "840540",
    "newPassword": "password123"
}
```

---

### **8. Mendapatkan Daftar Akun**
**Endpoint:** `GET /api/v1/account`

**Deskripsi:**
- Mengambil seluruh akun yang terdaftar
- Hanya bisa diakses oleh **superadmin**

**Headers:**
```json
Authorization: Bearer <token>
```

---
## Document Endpoints

### **1. Unggah Dokumen PDF**
**Endpoint:** `POST /api/v1/document/multi`

**Deskripsi:**
- Mengunggah file dokumen pdf
- Hanya bisa diakses oleh pengguna dengan role **superadmin** dan **admin**

**Headers:**
```json
Authorization: Bearer <token>
```

**Body (multipart/form-data):**
```
document: <file pdf>
docType: <tipe dokumen>
```

---
### **2. Unggah Data Dokumen**
**Endpoint:** `POST /api/v1/document/:docType`

**Deskripsi:**
- Mengunggah data dokumen
- Hanya bisa diakses oleh pengguna dengan role **superadmin** dan **admin**

**Headers:**
```json
Authorization: Bearer <token>
```

**Path Variables:**
```
docType: <jenis dokumen>
```

**Body (application/json):**
```json
{
    "docName":"Document1",
    "docType":"A01",
    "fileRef":["<id dokumen pdf>"]
}
```
**catatan:**
sesuaikan request body dengan skema model dokumen yang ada pada file docSchema.json

---
### **3. Mengunduh Dokumen PDF**
**Endpoint:** `GET /api/v1/document/pdf/:filename?requestedFile=pdf`

**Deskripsi:**
- Mengunduh file dokumen pdf

**Path Variables:**
```
filename: <nama dokumen (docName)>
```

---
### **4. Mendapatkan Data Dokumen**
**Endpoint:** `GET /api/v1/document/docs/:docId`

**Deskripsi:**
- Mendapatkan data dokumen

**Headers:**
```json
Authorization: Bearer <token>
```

**Path Variables:**
```
docId: <id dokumen>
```

---
## Catatan
- **Semua endpoint yang membutuhkan otorisasi harus menyertakan Bearer Token dalam header.**
- **Pastikan token valid untuk mengakses endpoint yang memerlukan autentikasi.**
