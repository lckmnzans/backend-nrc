const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";

    if (!validator.isLength(data.name, {min:3, max:50})) {
        errors.name = "Nama harus diantara 3 dan 50 karakter";
    }

    if (!validator.isLength(data.password, {min:6, max:50})) {
        errors.password = "Password minimal 6 karakter";
    }

    if (validator.isEmpty(data.name)) {
        errors.name = "Data nama dibutuhkan";
    }

    if (validator.isEmpty(data.email)) {
        errors.email = "Data email dibutuhkan";
    }

    if (!validator.isEmail(data.email)) {
        errors.email = "Email tidak valid";
    }

    if (validator.isEmpty(data.password)) {
        errors.password = "Data password dibutuhkan";
    }

    if (!validator.equals(data.password2, data.password)) {
        errors.password2 = "Data password dan confirmed password harus sama";
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = "Data confirm password dibutuhkan";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0 ? true : false
    }
}