/**
 * Implementing the actual person data management functionality.
 *
 * GET      /person             -> getPersonList
 *          /person:id          -> getPerson
 * POST     /person             -> newPerson
 * PUT      /person:id          -> updatePerson
 * PATCH    /person:id          -> updatePerson
 * DELETE   /person             -> deleteEveryPerson
 * DELETE   /person:id          -> deletePerson
 */

var PersonData = require('../models/personData.js');

var errorResponse = function(res, code, err) {
    console.log('Query error: ' + code + ': ' + err);
    res.status(code).send('{"error":"' + err + '"}');
}

exports.getPersonList = function(req, res) {
    console.log('Request: GET: list of all persons');
    PersonData.find(function (err, result) {
        if (err) { return errorResponse(res, 500, err)};
        res.status(200).json(result);
     });
};

exports.getPerson = function(req, res) {
    console.log('Request: GET: person data with id ' + req.params.id);
    var query = PersonData.where({_id: req.params.id});
    query.findOne(function (err, result) {
        if (err) { return errorResponse(res, 404, 'Requested resource not found')};
        return res.status(200).json(result);
    })
};

exports.newPerson = function(req, res) {
    var personData = new PersonData(req.body);
    console.log('Request: POST: adding a new person');
    console.log(req.body);

    if (checkPersonDataExistence(personData) && checkPersonDataValidity(personData)) {
        personData.save(function (err, result) {
            if (err) { return errorResponse(res, 500, err)};
            return res.status(200).json(result);
       });
    } else {
        return errorResponse(res, 400, 'Malformed body parameters');
    }
};

exports.updatePerson = function(req, res) {
    console.log('Request: UPDATE: update person with id ' + req.params.id);
    var updateData = req.body;
    console.log(updateData);

    // Performing the data validity check.
    if (checkPersonDataValidity(updateData)) {
        console.log(updateData);

        PersonData.findOne({_id: req.params.id}, function (err, result) {
            if (!result || err) { return errorResponse(res, 404, 'Target resource not found')};

            PersonData.update(result, updateData, function (err, result) {
                if (err) { return errorResponse(res, 500, err)};
                return res.status(200).json(result);
            });
        });

    } else {
        return errorResponse(res, 400, 'Malformed body parameters');
    }
};

exports.deleteEveryPerson = function(req, res) {
    console.log('Request: DELETE: delete whole person database');
    PersonData.remove({}, function(err, result) {
        if (err) { return errorResponse(res, 500, err)};
        return res.status(200).json(result);
    });
};

exports.deletePerson = function(req, res) {
    console.log('Request: DELETE: delete a person with id ' + req.params.id);
    PersonData.find({_id: req.params.id}).remove(function (err, result) {
        if (err) { return errorResponse(res, 400, err)};
        return res.status(200).json(result);
    });
};

/* 
 * Performs checks on a PersonData-model to see if all the
 * fields have at least some content in them. The validity of the
 * content is not checked.
 *
 * Return: true if all required fields are filled.
 *         false if some are undefined.
 */
function checkPersonDataExistence (personDataObject) {
    if (typeof personDataObject.firstName === 'undefined' ||
        typeof personDataObject.lastName === 'undefined' ||
        typeof personDataObject.email === 'undefined' ||
        typeof personDataObject.dateOfBirth === 'undefined') {
        return false;
    } else {
        return true;
    }
}

/*
 * Performs basic checks on a PersonData-model to see if the data
 * it contains is valid. This function does NOT care if some values
 * are MISSING from the data; only existing values are checked.
 * 
 * Return: true if data is valid
 *         false if data has errors
 */
function checkPersonDataValidity (personDataObject) {
    // Email regex from: https://www.owasp.org/index.php/OWASP_Validation_Regex_Repository
    var nameRegex = '^[^\\d\\s]+$';
    var emailRegex = '^[a-zA-Z0-9+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$'

    // Checking the first name.
    if (typeof personDataObject.firstName !== 'undefined') {
        if (!personDataObject.firstName.match(nameRegex)) {
            return false;
        }
    }

    // Checking the last name.
    if (typeof personDataObject.lastName !== 'undefined') {
        if (!personDataObject.lastName.match(nameRegex)) {
            return false;
        }
    }

    // Checking the email.
    if (typeof personDataObject.email !== 'undefined') {
        if (!personDataObject.email.match(emailRegex)) {
            return false;
        }
    }

    if (typeof personDataObject.dateOfBirth !== 'undefined') {
        // Constructing a date object from the mongoose date object to
        // be able to use getTime() properly.
        var testObject = new Date(personDataObject.dateOfBirth);
        if (isNaN(testObject.getTime())) {
            return false;
        }
    }
    return true;
};
