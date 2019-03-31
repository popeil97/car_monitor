var mongoose = require('mongoose');

var WorkflowSchema = {
    location: { type: String },
    imageURL: { type: String },
    date: { type: String },
    parkingLot: { type: String },
    company: { type: String },
    state: { type: String }
};

module.exports = mongoose.model('Workflow', WorkflowSchema);