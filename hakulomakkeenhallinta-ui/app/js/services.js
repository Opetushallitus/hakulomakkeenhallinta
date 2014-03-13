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

services.service('HH', ['$http', '_', function ($http, _) {
    
    var applicationSystems = [];
    
    $http.get('http://localhost:8000/app/test-data/db-applicationSystem.json')
        .success(function (data) {
            applicationSystems.push(data);
    });
    
    this.listApplicationsystems = function() {
        return applicationSystems;
    };

    this.getApplicationSystem = function(id) {
        _.find(applicationSystems, function(as) { 
            return as.id === id;
        }); 
    };

    this.searchApplicationOptions = function(asid, term) {
        var applicationOptions = [];
        $http.get("https://itest-virkailija.oph.ware.fi:443/tarjonta-service/rest/v1/hakukohde/search", 
                {params: {searchTerms: term}} )
            .success(function (data) {
                _.each(data.result.tulokset, function(org) {
                   _.each(org.tulokset, function(ao) {
                        applicationOptions.push(ao);
                   })
            })
        });
        return applicationOptions
    };
}]);
