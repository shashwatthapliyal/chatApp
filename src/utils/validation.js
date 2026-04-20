const validator = require('validator');


const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password, age } = req.body;

    // First Name
    if (!firstName || firstName.trim() === "") {
        throw new Error("First name is required");
    }

    if (firstName.length < 3 || firstName.length > 50) {
        throw new Error("First name must be between 3 and 50 characters");
    }

    // Email
    if (!emailId) {
        throw new Error("Email is required");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email format");
    }

    // Password
    if (!password) {
        throw new Error("Password is required");
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 0,
        minSymbols: 1
    })) {
        throw new Error(
            "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
        );
    }

    // Age (optional but good)
    if (age !== undefined) {
        if (!validator.isInt(age.toString(), { min: 13, max: 100 })) {
            throw new Error("Age must be between 13 and 100");
        }
    }
};



const validateEditProfileData = (req) => {

    const allowedEditFields = ["firstName", "lastName", "photoUrl", "gender", "age", "about", "skills"];

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isEditAllowed;


}


module.exports = { validateSignUpData, validateEditProfileData };