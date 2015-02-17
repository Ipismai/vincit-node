// Configuration file.
'use strict';

// Configuration variables. All variables related to server-side
// behaviour should be defined here.
var configuration = {
    // Server port
    serverPort: 3000,
    
    // MongoDB configuration
    mongo: {
        dbpath: 'mongodb://localhost',
        dbname: 'vincitharkka',
        dbport: 27017
    }
};

module.exports = configuration;