const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    nickname: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true
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