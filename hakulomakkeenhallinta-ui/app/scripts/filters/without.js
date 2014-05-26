'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('without',[ '_', function (_) {
        return function(element, attribute) {
            if (!attribute) {
                attribute = 'children';
            }
            return _.omit(element, attribute);
        };
    }]);
