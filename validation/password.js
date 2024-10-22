const validator = require('validator')

module.exports = function validationPassword(password) {
    let errors = {};
    errors.error = false;
    
    if (!validator.isLength(password, { min: 6, max: 50 })) {
        errors.error = true;
        errors.message = "Password  must be between 6 and 50 characters";
        return errors;
    }
    return errors;
}