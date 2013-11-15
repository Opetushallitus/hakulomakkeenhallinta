'use strict';

/* Services */
var services = angular.module('hakulomakkeenhallinta.services', []);

services.service('Resources', ['$resource', function ($resource) {
    return {
        applicationSystems:         $resource('http://10.99.99.120:8080/hakulomakkeenhallinta-app/applicationSystems/:id'),
        applicationFormTemplates:   $resource('http://10.99.99.120:8080/hakulomakkeenhallinta-app/applicationFormTemplates/:id'),
        applicationForms:           $resource('http://10.99.99.120:8080/hakulomakkeenhallinta-app/applicationForms/:id'),
        applicationOptions:         $resource('http://localhost:8000/app/test-data/applicationOptions.json'),
        additionalQuestions:        $resource('http://localhost:8000/app/test-data/additionalQuestions.json'),
        themes:                     $resource('http://localhost:8000/app/test-data/themes.json'),
        types:                      $resource('http://localhost:8000/app/test-data/types.json'),
        languages:                  $resource('http://localhost:8000/app/test-data/languages.json')
    };
}]);