'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
  .directive('hhInputlink', function () {
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
