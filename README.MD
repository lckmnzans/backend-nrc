# API Archiving

Backend untuk Aplikasi Arsip Digital dengan express dan mongo.

## Daftar Isi
- [Instruksi](#instruksi)
- [Penggunaan](#pengunaan)

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
SERVER_HOSTNAME=localhost
SERVER_PORT=8000

MONGODB_URI=mongodb://127.0.0.1:27017

# Variabel ini mengatur email server untuk endpoint yang memerlukan akses email
SMTP_USER=user@mail.co
SMTP_PASS=password

# Variabel ini adalah alamat frontend, diperlukan bagi backend agar bisa mengirimkan link reset password ke halaman frontend
VUE_URI=http://localhost:8080
```

#### Jalankan server
```bash
npm run dev
```

<!-- ## Penggunaan API
API berikut digunakan untuk melakukan pengarsipan termasuk unduh dan unggah data, serta termasuk untuk login, register dan ubah akun

### <b>/api/v1/account</b>
- <b>POST '/login'</b> <br> log in account
    - request body: <i>application/x-www-form-urlencoded</i> 
    <br>username: <i>string</i>
    <br>password: <i>string</i>
- <b>POST '/register'</b> <br> register a new account
    - header:
    <br>Authorization: <i>Bearer {token}</i>
    - request body: <i>application/json</i> 
    <br>username: <i>string</i>
    <br>email: <i>string</i>
    <br>role: <i>string</i>
    <br>password: <i>string</i>
    <br>password2: <i>string</i>
- <b>GET '/profile'</b> <br> get to profile
    - header:
    <br>Authorization: <i>Bearer {token}</i>
- <b>GET '/'</b> <br> get all accounts
    - header:
    <br>Authorization: <i>Bearer {token}</i>
- <b>PATCH '/'</b> <br> change old to new password
    - header:
    <br>Authorization: <i>Bearer {token}</i>
    - request body: <i>application/json</i> 
    <br>username: <i>string</i>
    <br>oldPassword: <i>string</i>
    <br>newPassword: <i>string</i>
- <b>POST '/request-reset'</b> <br> request to reset password
    - request body: <i>application/json</i> 
    <br>username: <i>string</i>
    <br>email: <i>string</i>
- <b>POST '/approve-reset/{userId}'</b> <br> approve request to reset password
    - header:
    <br>Authorization: <i>Bearer {token}</i>
    - request body: <i>application/json</i> 
    <br>username: <i>string</i>
    <br>email: <i>string</i>
- <b>POST '/reset-pass'</b> <br> create a new password
    - request params: token
    - request body: <i>application/json</i> 
    <br>otp: <i>string</i>
    <br>newPassword: <i>string</i>

### <b>/api/v1/document</b>
- <b>POST '/'</b> <br> upload a document
    - header:
    <br>Authorization: <i>Bearer {token}</i>
    - request body: <i>multipart/form-data</i> 
    <br>document: <i>pdf</i>
- <b>GET '/{document-name}'</b> <br> download a document
- <b>GET '/list-document'</b> <br> get list of all documents -->