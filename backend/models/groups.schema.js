const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupsSchema = new Schema({
    name: {
        type: String,
    },
    author: {
        type: Schema.ObjectId,
        ref: 'users',
        trim: true
    },
    description: {
        type: String
    },
    category: {
        type: String
    },
    nr_members: {
        type: Number
    },
    created_at: {
        type: String
    },
    date_at: {
        type: String
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    }
});

module.exports = mongoose.model('group', GroupsSchema);