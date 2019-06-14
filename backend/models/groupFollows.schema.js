const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupFollowsSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'users'
    },
    grfollowed: {
        type: Schema.ObjectId,
        ref: 'groups'
    }
});

module.exports = mongoose.model('groupfollows', GroupFollowsSchema);