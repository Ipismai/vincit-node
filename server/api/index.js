// Connecting API requests to the appropriate functionality.

var express = require('express');
var controller = require('./apiController');
var router = express.Router();

router.get('/person', controller.getPersonList);
router.get('/person/:id', controller.getPerson);
router.post('/person', controller.newPerson);
router.put('/person/:id', controller.updatePerson);
router.patch('/person/:id', controller.updatePerson);
router.delete('/person', controller.deleteEveryPerson);
router.delete('/person/:id', controller.deletePerson);

module.exports = router;