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
        themes:                     $resource('http://localhost:8000/app/test-data/themes.json'),
        types:                      $resource('http://localhost:8000/app/test-data/types.json'),
        languages:                  $resource('http://localhost:8000/app/test-data/languages.json')
    };
}]);



services.service('_', [function () {
    return window._;
}]);
