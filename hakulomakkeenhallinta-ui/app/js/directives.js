'use strict';

/* Directives */


angular.module('hakulomakkeenhallinta.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]).directive('requiredfield', function () {
        return {
            restrict: "E",
            templateUrl: 'partials/lisakysymykset/questions/directives/required-field.html'
        }
    });
