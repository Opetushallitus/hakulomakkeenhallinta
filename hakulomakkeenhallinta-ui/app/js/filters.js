'use strict';

/* Filters */

angular.module('hakulomakkeenhallinta.filters', [])
    .filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }])
    .filter('i18n', function () {
        return function (element, attribute, lang) {
            if (!attribute) {
                attribute = 'i18nText';
            }
            if (!lang) {
                lang = 'fi';
            }
            return element[attribute].translations[lang];
        }
    });
