const mongoose = require('mongoose')

const roleStatus = ['admin', 'sale']
const titles = ['นาย.', 'นาง.', 'น.ส.', 'Mr.', 'Ms.']

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: titles,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: roleStatus,
        required: true
    },
    tel: {
        type: String,
        required: true,
        unique: true
    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)