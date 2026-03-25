const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Email is invalid.....")
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: 18,

    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender value is not valid ")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5TPu3HoTZkTyxzVY6h3fuKo-nPU85G5u4Vw&s",
    },
    about: {
        type: String,
        default: "This is a defalt description about the user",
    },
    skills: {
        tye: [String],
    }
}, {
    timestamps: true,
});

// const UserModel = mongoose.model("user", userSchema);

// Mongoose Schema Method
userSchema.methods.getJWT = function () {
    const token = jwt.sign({ _id: this._id }, "secretKey", {
        expiresIn: "7d",
    })
    return token;
}
// Mongoose Schema Method
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, this.password);

    return isPasswordValid;
}

userSchema.methods.encryptPassword = async function (passwordInputByUser) {
    const encryptedPassword = await bcrypt.hash(passwordInputByUser, 10);
    return encryptedPassword;
}

module.exports = mongoose.model("user", userSchema);