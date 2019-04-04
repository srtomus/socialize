const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowsSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    followed: {
        type: Schema.ObjectId,
        ref: 'users'
    }
});

module.exports = mongoose.model('follows', FollowsSchema);