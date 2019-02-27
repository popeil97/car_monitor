var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    company: { type: String, required: true }
};

module.exports = mongoose.model('User', UserSchema);