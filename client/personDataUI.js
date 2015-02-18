// Performing API queries for the client and providing results.

'use strict';

angular.module('personDataUI', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider
            .otherwise('/'); // Redirect to index.

        $stateProvider
            .state('dataUI', {
                url: "/",
                templateUrl: "dataUI.html",
                controller: 'dataUIController'
            });

        $locationProvider.html5Mode(true); // For removing # in url
    });

angular.module('personDataUI')
    .controller('dataUIController', function ($scope, $http) {

        $scope.dataList = [];

        $scope.message = {
            visible: false,
            title: 'Error!',
            content: 'Unknown error.'
        }

        $scope.editor = {
            modType: 'new',
            visible: false,
            person: {
                _id: null,
                firstName: '',
                lastName: '',
                email: '',
                dateOfBirth: ''
            }
        }

        $scope.editNew = function() {
            $scope.editor.person = {};
            $scope.editor.modType = 'new';
            $scope.editor.visible = true;
        }

        $scope.editExisting = function(data) {
            $scope.editor.modType = 'edit';
            $scope.editor.visible = true;
            $scope.editor.person = {
                _id: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                dateOfBirth: data.dateOfBirth
            }
        }

        $scope.commitEdit = function() {
            if ($scope.editor.modType === 'new') {
                postPerson();
            } else if ($scope.editor.modType == 'edit') {
                putPerson();
            }
        }

        $scope.cancelEdit = function() {
            // Clearing all the fields so no data will linger.
            $scope.editor.person = {};
            $scope.editor.visible = false;
        }

        function displayMessage(title, message) {
            $scope.message.visible = true;
            $scope.message.title = title;
            $scope.message.content = message;
        }

        /*
         *  API COMMUNICATION FUNCTIONS
         */

        $scope.refreshPersonList = function() {
            $http.get('/api/person').success(function (result) {
                $scope.dataList = result;
            });
        }

        $scope.deletePerson = function(id) {
            $http.delete('/api/person/' + id)
            .success(function (result) {
                displayMessage('Success', 'Person was succesfully deleted from database');
                $scope.refreshPersonList();
            })
            .error(function (result) {
                displayMessage('Error!', 'Person could not be deleted!');
                $scope.refreshPersonList();
            });
        }

        $scope.deleteEveryPerson = function() {
            $http.delete('/api/person')
            .success(function (result) {
                displayMessage('Success', 'Person database was succesfully emptied.');
                $scope.refreshPersonList();
            })
            .error(function (result) {
                displayMessage('Error!', 'Person database could not be emptied.');
                $scope.refreshPersonList();
            });
        }

        function postPerson() {
            $http.post('/api/person', {
                firstName: $scope.editor.person.firstName,
                lastName: $scope.editor.person.lastName,
                email: $scope.editor.person.email,
                dateOfBirth: $scope.editor.person.dateOfBirth
            })
            .success(function (result) {
                displayMessage('Success', 'Person was succesfully added to the database.');
                $scope.cancelEdit();
                $scope.refreshPersonList();
            })
            .error(function (result) {
                displayMessage('Error!', 'Person could not be added.');
            });
        }

        // What a stupid script, doesn't even use patch when it could. There goes the cloud service funds.
        function putPerson() {
            $http.put('/api/person/' + $scope.editor.person._id, {
                firstName: $scope.editor.person.firstName,
                lastName: $scope.editor.person.lastName,
                email: $scope.editor.person.email,
                dateOfBirth: $scope.editor.person.dateOfBirth
            })
            .success(function (result) {
                displayMessage('Success', 'Person\'s data was succesfully modified.');
                $scope.cancelEdit();
                $scope.refreshPersonList();
            })
            .error(function (result) {
                displayMessage('Error!', 'Person\'s data could not be modified.');
            });
        }
});