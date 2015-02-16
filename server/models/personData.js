var mongoose = require('mongoose');

var personDataSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    dateOfBirth: Date
});

module.exports = mongoose.model("PersonData", personDataSchema);