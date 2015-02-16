/**
 * Implementing the actual person data management functionality.
 *
 * GET      /person             -> getPersonList
 *          /person:id          -> getPerson
 * POST     /person             -> newPerson
 * PUT      /person:id          -> updatePerson
 * PATCH    /person:id          -> updatePerson
 * DELETE   /person:id          -> deletePerson
 */

 var PersonData = require('../models/personData.js');
 
 var errorResponse = function(res, err) {
    console.log('Query error: $s', err);
    res.status(500).send(err);
 }
 
 exports.getPersonList = function(req, res) {
    PersonData.find(function (err, result) {
        if (err) { return errorResponse(res, err)};
        return res.status(200).json(result);
     });
 };
 
 exports.getPerson = function(req, res) {
    var query = PersonData.where({id: req.body.id});
    query.findOne(function (err, result) {
        if (err) { return errorResponse(res, err)};
        return res.status(200).json(result);
    })
 };
 
 exports.newPerson = function(req, res) {
    var dataEntry = new PersonData({z
        firstName: 'Sami',
        lastName: 'Testi',
        email: 'testisami@gmail.com',
        dateOfBirth: 0
    });
    
    dataEntry.save(function (err, result) {
        if (err) { return errorResposne(res, err)};
        return res.status(200).json(result);
    });
 };
 
 exports.updatePerson = function (err, result) {
     
     
 };
 
 exports.deletePerson = function (err, result) {
     
     
 };
