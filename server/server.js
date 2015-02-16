/**
 * Main application file
 */

'use strict';

// Dependency definitions.
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config');

var api = require('./api');

// Connect to database
mongoose.connect(config.mongo.dbpath + ':' + config.mongo.dbport +
                 '/' + config.mongo.dbname);

/* Populate DB with sample data TODO: Seeding
if (config.mongo.seedDB === true) { require('./config/prepopulate'); }
*/

// Configuring the server.
var app = express();

app.use('/api', api);

// Starting the server.
var server = app.listen(config.serverPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Server started on address %s listening on port %s', host, port);
});