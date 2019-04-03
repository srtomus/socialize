const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        trim: true
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
    groups: [String],
    interests: [String]
});

module.exports = mongoose.model('usuarios', UserSchema);