'use strict';

/* Filters */

angular.module('hakulomakkeenhallinta.filters', [])
    .filter('i18n', function() {
        return function(element, attribute, lang) {
            if (element) {
                if (!attribute) {
                    attribute = 'i18nText';
                }
                if (!lang) {
                    lang = 'fi';
                }
                if (element[attribute] && element[attribute].translations && element[attribute].translations[lang]) {
                    return element[attribute].translations[lang];
                }
            }
            return "";
        };
    })

.filter('without', ['_',
    function(_) {
        return function(element, attribute) {
            if (!attribute) {
                attribute = 'children';
            }
            return _.omit(element, attribute);
        };
    }
]);
