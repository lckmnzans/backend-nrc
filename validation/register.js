const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let data = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (validator.isEmpty(data.name)) {
        errors.name = "Data nama tidak boleh kosong";
    }

    if (!validator.isLength(data.name, {min:3,max:50})) {
        errors.name = "Nama harus di antara 3 sampai 50 karakter";
    }

    if (validator.isEmpty(data.email)) {
        errors.email = "Data email tidak boleh kosong";
    }

    if (!validator.isEmail(data.email)) {
        errors.email = "Email tidak valid";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Password dibutuhkan";
    }

    if (!validator.isLength(data.password, {min:6,max:50})) {
        errors.password = "Password harus di antara 6 sampai 50 karakter";
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = "Konfirmasi password dibutuhkan";
    }

    if (!validator.equals(data.password2, data.password)) {
        errors.password2 = "Password dan konfirmasi password harus sama";
    }

    return {
        errors,
        isValid: isEmpty(errors) === undefined ? true : isEmpty(errors)
    }
}