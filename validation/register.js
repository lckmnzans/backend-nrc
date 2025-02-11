const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.username = !isEmpty(data?.username) ? data.username : "";
    data.email = !isEmpty(data?.email) ? data.email : "";
    data.role = !isEmpty(data?.role) ? data.role : "";
    data.password = !isEmpty(data?.password) ? data.password : "";
    data.password2 = !isEmpty(data?.password2) ? data.password2 : "";

    if (!validator.isLength(data.username, {min:4, max:50})) {
        errors.username = "Username harus diantara 4 dan 50 karakter";
    }

    if (!validator.isLength(data.password, {min:6, max:50})) {
        errors.password = "Password minimal 6 karakter";
    }

    if (validator.isEmpty(data.username)) {
        errors.username = "Data username dibutuhkan";
    }

    if (validator.isEmpty(data.email)) {
        errors.email = "Data email dibutuhkan";
    }

    if (!validator.isEmail(data.email)) {
        errors.email = "Email tidak valid";
    }

    if (validator.isEmpty(data.role)) {
        errors.role = "Data role dibutuhkan";
    } else if (!['user','admin', 'superuser'].includes(data.role)) {
        errors.role = "Role hanya bisa berupa 'admin' atau 'superuser'";
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