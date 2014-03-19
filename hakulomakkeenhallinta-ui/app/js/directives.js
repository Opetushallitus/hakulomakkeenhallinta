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



directives.directive('elementTree', function() {
      return {
        template: '<ul><element ng-repeat="element in tree"></choice></ul>',
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: {
          tree: '=ngModel'
        }
      };
});

directives.directive('element', function($compile, $templateCache) {
  var getTemplate = function(type) {
        var template = $templateCache.get(type);
        if (template) {
           return template;
        } else {
            return $templateCache.get('element');
        }
  }
  return { 
    restrict: 'E',
    template: '<li>' +
      '<span>' +
        '{{element | i18n}}' +
      '</span>' +
    '</li>',
    link: function(scope, elm, attrs) {
        elm.html(getTemplate(scope.element._class.split(".").pop()));
        $compile(elm.contents())(scope);
      if (scope.element.children.length > 0) {
        var childElement = $compile('<element-tree ng-model="element.children"></element-tree>')(scope)
        elm.append(childElement);
      }
    }
  };
});
