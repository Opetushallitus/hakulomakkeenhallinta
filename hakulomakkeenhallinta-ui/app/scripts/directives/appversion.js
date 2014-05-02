'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives', [])
  .directive('appVersion', function () {
    return {
        restrict: "E",
        templateUrl: 'partials/lisakysymykset/questions/directives/required-field.html'
    };
  });
