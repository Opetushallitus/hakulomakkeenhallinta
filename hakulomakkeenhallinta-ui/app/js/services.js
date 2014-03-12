'use strict';

/* Services */
var services = angular.module('hakulomakkeenhallinta.services', []);

services.service('Resources', ['$resource', function ($resource) {
    return {
        form:                       $resource('http://localhost:8000/app/test-data/form.json'),
    applicationSystem:          $resource('http://localhost:8000/app/test-data/db-applicationSystem.json'),
    applicationSystems:         $resource('http://localhost:8000/app/test-data/applicationSystems.json'),
    applicationFormTemplates:   $resource('http://localhost:8000/app/test-data/applicationFormTemplates.json'),
    applicationOptions:         $resource('http://localhost:8000/app/test-data/applicationOptions.json'),
    additionalQuestions:        $resource('http://localhost:8000/app/test-data/additionalQuestions.json'),
    types:                      $resource('http://localhost:8000/app/test-data/types.json'),
    languages:                  $resource('http://localhost:8000/app/test-data/languages.json')
    };
}]);



services.service('_', [function () {
    return window._;
}]);

services.service('AS', ['$http', '_', function ($http, _) {
    
    var applicationSystems = [];
    var applicationOptions = [];
    
    $http.get('http://localhost:8000/app/test-data/db-applicationSystem.json')
        .success(function (data) {
            applicationSystems.push(data.result);
    });
    
    $http.get('http://localhost:8000/app/test-data/applicationOption.json')
        .success(function (data) {
            applicationOptions.push(data.result);
    });

    this.listApplicationsystems = function() {
        return applicationSystems;
    };

    this.getApplicationSystem = function(id) {
        _.find(applicationSystems, function(as) { 
            return as.id === id;
        }); 
    };

    this.getApplicationOptions =function(asid, term) {
        return _.find(applicationOptions, function(ao) { 
            return ao.hakukohteenNimi.indexOf(term) != -1;
        }); 
    };
}]);
