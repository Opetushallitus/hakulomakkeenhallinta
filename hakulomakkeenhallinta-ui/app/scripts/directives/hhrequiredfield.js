'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
  .directive('hhRequiredfield', function () {
    return {
        restrict: "E",
        templateUrl: 'partials/lisakysymykset/questions/directives/required-field.html'
      }
  });
