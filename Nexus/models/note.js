const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    isArchived :{type:Boolean, default: false},
    user:String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);
