const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    text: String,
    viewed: String,
    created_at: String,
    emitter: { type: Schema.ObjectId, ref: 'users' },
    receiver: { type: Schema.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('message', MessageSchema);