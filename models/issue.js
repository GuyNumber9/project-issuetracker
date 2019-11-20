const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issue_title: String,
    issue_text: String,
    created_on: Date,
    updated_on: Date,
    created_by: String,
    assigned_to: String,
    open: Boolean,
    status_text: String
});

module.exports = {
    schema: issueSchema,
    model: mongoose.model('issues', issueSchema)
};