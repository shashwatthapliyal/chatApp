const validator = require('validator');


const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName) throw new Error("First name is required");

    // else if (firstName.length < 4 || firstName.length > 50)
    //     throw new Error("First name should be 4 - 50 character")


    if (!emailId) throw new Error("Email is required");
    else if (!validator.isEmail(emailId)) throw new Error("Email is invalid....");

    if (!password) throw new Error("Password is required");
    else if (!validator.isStrongPassword(password)) throw new Error("Password is weak....");

}

module.exports = validateSignUpData;