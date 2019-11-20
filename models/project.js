const mongoose = require('mongoose');
const issueSchema = require('./issue').schema;

const projectSchema = new mongoose.Schema({
    name: String,
    issues: [issueSchema]
})

module.exports = {
    model: mongoose.model('Projects', projectSchema),
    schema: projectSchema
};