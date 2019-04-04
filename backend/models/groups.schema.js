const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupsSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'users',
        trim: true
    },
    description: {
        type: String,
        lowercase: true,
        required: true,
        trim: true
    },
    nr_members: {
        type: Number
    },
    created_at: {
        type: String
    },
    image: {
        type: String
    },
    date_at: {
        type: String
    }
});

module.exports = mongoose.model('groups', GroupsSchema);