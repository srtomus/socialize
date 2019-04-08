const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        required: true
    },
    nickname: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true,
        minlength: 5,
        maxlength: 15
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String
    },
    interests: [String]
});


module.exports = mongoose.model('users', UserSchema);