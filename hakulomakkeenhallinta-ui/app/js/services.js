'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []).value('version', '0.1');

services.service('Resources', ['$resource', function ($resource) {
    return {
        applicationSystems:         $resource('http://10.99.99.214:8080/hakulomakkeenhallinta-app/applicationSystems/:id'),
        applicationFormTemplates:   $resource('http://10.99.99.214:8080/hakulomakkeenhallinta-app/applicationFormTemplates/:id'),
        applicationForms:           $resource('http://localhost:63342/hakulomakkeenhallinta/hakulomakkeenhallinta-ui/app/test-data/applicationForms.json'),
        applicationOptions:         $resource('http://localhost:63342/hakulomakkeenhallinta/hakulomakkeenhallinta-ui/app/test-data/applicationOptions.json')
    };
}]);
