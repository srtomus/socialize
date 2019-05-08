const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PublicationSchema = new Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    file: {
        type: String
    },
    created_at: {
        type: String
    },
    user: { type: Schema.ObjectId, ref: 'users' }
});

module.exports = mongoose.model('publication', PublicationSchema);