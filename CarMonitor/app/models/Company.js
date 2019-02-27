var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CompanySchema = {
    username: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    workers: { type: Array },
    parkingLots: { type: Array }
};

module.exports = mongoose.model('Company', CompanySchema);