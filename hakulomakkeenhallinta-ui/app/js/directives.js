'use strict';

/* Directives */


var directives = angular.module('hakulomakkeenhallinta.directives', []).
    directive('appVersion', ['version', function (version) {
        return function (scope, elm, attrs) {
            elm.text(version);
        };
    }]);

directives.directive('hhRequiredfield', function () {
    return {
        restrict: "E",
        templateUrl: 'partials/lisakysymykset/questions/directives/required-field.html'
    }
});
directives.directive('hhRequiredfield', function () {
    return {
        restrict: "E",
        templateUrl: 'partials/templates/lorem.html'
    }
});


directives.directive('hhInputtext', function () {
    return {
        restrict: 'E',
        scope: {
            'model': '=ngModel'
        },
        require: 'ngModel',
        replace: true,
        templateUrl: 'partials/lisakysymykset/questions/directives/input-text.html',
        link: function (scope, element, attrs) {

            scope.label = attrs.label;
        }
    }
});

directives.directive('hhInputlink', function () {
    return {
        restrict: 'E',
        scope: {
            'model': '=ngModel'
        },
        require: 'ngModel',
        replace: true,
        templateUrl: 'partials/lisakysymykset/questions/directives/input-link.html',
        link: function (scope, element, attrs) {
            scope.label = attrs.label;
        }
    }
});
