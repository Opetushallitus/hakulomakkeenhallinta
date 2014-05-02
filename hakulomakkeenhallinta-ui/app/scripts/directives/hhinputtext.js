'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
  .directive('hhInputtext', function () {
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
