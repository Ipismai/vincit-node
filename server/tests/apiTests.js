/**
 * API testing file. Intended to be used on a locally running server instance.
 */

'use strict';

var config = require('../config');
var supertest = require('supertest');
var api = supertest('http://localhost:' + config.serverPort + '/api');

describe('API functionality with expected parameters', function () {

    // Clearing the PersonData-database.
    it ('DELETE api/person -> Expect 200, clear database', function(done) {
        api.delete('/person')
        .expect(200, done);
    });

    // Get with empty database, expecting it to be empty.
    it ('GET api/person -> Expect 200 with empty list.', function(done) {
        api.get('/person')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            // If res.body isn't empty, loop runs and triggers an error.
            for (var content in res.body) {
                return done(new Error('List was not empty'));
            }
            done();
        });
    });

    // Picking up the ID to use it for more complex queries.
    var postedPersonID;
    it ('POST api/person with functional body -> Expect 200', function (done) {
        api.post('/person')
        .send({firstName: 'Testimus', lastName: 'Maximus', email: 'testmax@gmail.com', dateOfBirth: 0})
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            postedPersonID = res.body._id;
            done();
        });
    });

    it ('GET api/person with ID of previously added person -> Expect 200', function (done) {
        api.get('/person/' + postedPersonID)
        .expect(200, done);
    });

    it ('PATCH api/person with ID of previously added person -> Expect 200', function (done) {
        api.patch('/person/' + postedPersonID)
        .send({lastName: 'Minimus'})
        .expect(200, done);
    });

    it ('GET api/person with the ID of previously updated person -> Expect 200', function (done) {
        api.get('/person/' + postedPersonID)
        .end(function (err, res) {
            if (err) return done(err);
            if (res.body.lastName !== 'Minimus') { 
                return done(new Error('Last name did not update'))
            }
            done();
        })
    });

    it ('PUT api/person with ID of previously updated person -> Expect 200', function (done) {
        api.put('/person/' + postedPersonID)
        .send({firstName: 'Something', lastName: 'Completely', email: 'new@here.today',
            dateOfBirth: new Date('1991-05-20')})
        .expect(200, done);
    });

    it ('DELETE api/person with ID of previously added person. -> Expect 200', function (done) {
        api.delete('/person/' + postedPersonID)
        .expect(200, done);
    });

});

describe('API functionality with unexpected parameters', function() {

    // Picking up the ID to use it for more complex queries.
    var postedPersonID;
    it ('POST api/person FOR FURTHER TESTING -> Expect 200', function (done) {
        api.post('/person')
        .send({firstName: 'Testimus', lastName: 'Maximus', email: 'testmax@gmail.com', dateOfBirth: 0})
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            postedPersonID = res.body._id;
            done();
        });
    });

    it ('POST api/person with missing values -> Expect 400', function (done) {
        api.post('/person')
        .send({firstName: 'Testimus', email: 'testmax@gmail.com', dateOfBirth: 0})
        .expect(400, done);
    });

    it ('POST api/person with erroneous first name -> Expect 400', function (done) {
        api.post('/person')
        .send({firstName: 'Testi Mus', lastName: 'Maximus', email: 'testmax@gmail.com', dateOfBirth: 0})
        .expect(400, done);
    });

    it ('POST api/person with erroneous last name -> Expect 400', function (done) {
        api.post('/person')
        .send({firstName: 'Testimus', lastName: 'Max1imus', email: 'testmax@gmail.com', dateOfBirth: 0})
        .expect(400, done);
    });

    it ('POST api/person with erroneous email -> Expect 400', function (done) {
        api.post('/person')
        .send({firstName: 'Testimus', lastName: 'Maximus', email: 'testmax @gmail.com', dateOfBirth: 0})
        .expect(400, done);
    });

    it ('POST api/person with erroneous date of birth -> Expect 400', function (done) {
        api.post('/person')
        .send({firstName: 'Testimus', lastName: 'Maximus', email: 'testmax @gmail.com', dateOfBirth: 'potato'})
        .expect(400, done);
    });

    it ('PUT api/person with erroneous first name-> Expect 400', function (done) {
        api.put('/person/' + postedPersonID)
        .send({firstName: 'Some  1', lastName: 'Completely', email: 'new@here.today',
            dateOfBirth: new Date('1993-05-20')})
        .expect(400, done);
    });

    it ('PUT api/person with erroneous last name-> Expect 400', function (done) {
        api.put('/person/' + postedPersonID)
        .send({firstName: 'Some', lastName: 'S-O-M-E3', email: 'new@here.today',
            dateOfBirth: new Date('1993-05-20')})
        .expect(400, done);
    });

    it ('PUT api/person with email -> Expect 400', function (done) {
        api.put('/person/' + postedPersonID)
        .send({firstName: 'Some  1', lastName: 'Completely', email: 'new@her fae.today',
            dateOfBirth: new Date('1993-05-20')})
        .expect(400, done);
    });

    it ('PUT api/person/noresourcehere without data -> Expect 404', function(done) {
        api.put('/person/noresourcehere')
        .expect(404, done);
    });

    it ('PUT api/person/noresourcehere with data -> Expect 400', function (done) {
        api.put('/person/' + postedPersonID)
        .send({firstName: 'Some  1', lastName: 'Completely', email: 'new@her fae.today',
            dateOfBirth: new Date('1993-05-20')})
        .expect(400, done);
    });

    it ('PATCH api/person/noresourcehere without data -> Expect 404', function(done) {
        api.patch('/person/noresourcehere')
        .expect(404, done);
    });

    it ('PATCH api/person/noresourcehere with data -> Expect 400', function (done) {
        api.patch('/person/' + postedPersonID)
        .send({firstName: 'Some  1'})
        .expect(400, done);
    });

    it ('DELETE api/person USED FOR FURTHER TESTING -> Expect 200', function (done) {
        api.delete('/person/' + postedPersonID)
        .expect(200, done);
    });

});

/*
describe('State testing', function() {

    // Defining the persons used for this test.
    var person1id, person2id, person3id;

    var person1 = {
        firstName: 'First',
        lastName: 'Fahrenheit',
        email: 'finishfast@fastmail.com',
        dateOfBirth: new Date('1990-03-22')
    };

    var person2 = {
        firstName: 'Second',
        lastName: 'Sekkuri',
        email: 'secsek@sumomailbox.org',
        dateOfBirth: new Date('1955-05-03')
    };

    var person3 = {
        firstName: 'Third',
        lastName: 'Tesseract',
        email: 'thite@mailinator.com',
        dateOfBirth: new Date('1985-05-03')
    };

    // Clearing the PersonData-database.
    it ('Clearing whole database', function(done) {
        api.delete('/person')
        .expect(200, done);
    });

    // Picking up the ID to use it for more complex queries.
    it ('Posting first person data.', function (done) {
        api.post('/person')
        .send(person1)
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            person1id = res.body._id;
            done();
        });
    });

        // Picking up the ID to use it for more complex queries.
    it ('Posting second person data.', function (done) {
        api.post('/person')
        .send(person2)
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            person2id = res.body._id;
            done();
        });
    });

        // Picking up the ID to use it for more complex queries.
    it ('Posting third person data.', function (done) {
        api.post('/person')
        .send(person3)
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            person3id = res.body._id;
            done();
        });
    });

    it ('Getting person list, checking data validity.', function (done) {
        api.get('/person')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) { return done(err) };

            for (var person in res.body) {
                if (person._id === person1id) {
                    if (person.firstName !== person1.firstName ||
                        person.lastName !== person1.lastName ||
                        person.email !== person1.email ||
                        person.dateOfBirth !== person1.dateOfBirth) {
                        return done(new Error('Data was not valid'));
                    }
                } else if (person._id === person2id) {
                    if (person.firstName !== person2.firstName ||
                        person.lastName !== person2.lastName ||
                        person.email !== person2.email ||
                        person.dateOfBirth !== person2.dateOfBirth) {
                        return done(new Error('Data was not valid'));
                    } 
                } else if (person.id === person3id) {
                    if (person.firstName !== person3.firstName ||
                        person.lastName !== person3.lastName ||
                        person.email !== person3.email ||
                        person.dateOfBirth !== person3.dateOfBirth) {
                        return done(new Error('Data was not valid'));
                    }
                } else {
                    return done(new Error('Person ID invalid.' + person._id));
                }
            }
            done();
        });
    });

}); */