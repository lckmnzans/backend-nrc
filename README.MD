# API Archiving

Backend untuk Aplikasi Arsip Digital dengan express dan mongo.

## Daftar Isi
- [Instruksi](#instruksi)
- [Penggunaan](#pengunaan)

## Instruksi
Diperlukan dependensi berikut
- mongodb 8.x
- nodejs 10.x

```bash
# Clone repositori ini
git clone https://github.com/lckmnzans/backend-nrc.git

# Masuk ke direktori proyek
cd backend-nrc

# Install dependensi proyek
npm install

# Install dependensi global jika belum ada
npm install -g dotenv

# Jalankan server
npm start

```

## Penggunaan API
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
- <b>GET '/list-document'</b> <br> get list of all documents