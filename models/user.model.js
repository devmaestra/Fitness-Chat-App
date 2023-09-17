const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    locationZip: {
        type: String,
        required: true
    },

    firstName: {        // internally collected only
        type: String,
        required: true,
    },
    lastName: {        // internally collected only
        type: String,
        required: true,
    },
    bioTagline: {
        type: String,
    },
    bioParagraph : {
        type: String
    },
    userImage : {
        type: String // or and Array of Strings pointing to URLs
    }
});

module.exports = mongoose.model('User', UserSchema);