'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
  .directive('hhInputtext',[ 'LocalisationService', function (LocalisationService) {
    return {
        restrict: 'E',
        scope: {
            'model': '=ngModel',
            'changeFn': '=ngChange'
        },
        require: 'ngModel',
        replace: true,
        templateUrl: 'partials/lisakysymykset/questions/directives/input-text.html',
        link: function (scope, element, attrs) {
            scope.label = '';
            var key  = attrs.label;
            LocalisationService.getTranslation(key).then(
                function(data){
                    scope.label = data;
                });
        }
      }
  }]);
