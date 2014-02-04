'use strict';

/* Services */
var services = angular.module('hakulomakkeenhallinta.services', []);

services.service('Resources', ['$resource', function ($resource) {
    return {
        form:                       $resource('http://localhost:8000/app/test-data/form.json'),
        applicationSystems:         $resource('http://localhost:8000/app/test-data/applicationSystems.json'),
        applicationFormTemplates:   $resource('http://localhost:8000/app/test-data/applicationFormTemplates.json'),
        applicationForms:           $resource('http://localhost:8000/app/test-data/applicationForms.json'),
        applicationOptions:         $resource('http://localhost:8000/app/test-data/applicationOptions.json'),
        additionalQuestions:        $resource('http://localhost:8000/app/test-data/additionalQuestions.json'),
        themes:                     $resource('http://localhost:8000/app/test-data/themes.json'),
        types:                      $resource('http://localhost:8000/app/test-data/types.json'),
        languages:                  $resource('http://localhost:8000/app/test-data/languages.json')
    };
}]);
