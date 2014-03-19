'use strict';

/* Filters */

angular.module('hakulomakkeenhallinta.filters', [])
.filter('i18n', function () {
    return function (element, attribute, lang) {
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
        return ""
    }
})

.filter('themesWithAdditionalQuestions', ['_', function (_) {
    return function (element) {
        var formWalker = _.walk(function(element) {
            return element.children;
        });

        $scope.themes = formWalker.filter(applicationSystem.form, _.walk.preorder, function(el) {
            return el._class && el._class.indexOf("Theme") != -1 && el.additionalQuestions;
        });
    }
}]);
