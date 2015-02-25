'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters', [])
  .filter('i18n', function () {
        return function (element, attribute, lang) {
            if (element) {
                if (!attribute) {
                    attribute = 'i18nText';
                }
                if (!lang) {
                    lang = 'fi';
                }
                if (element[attribute] && element[attribute].translations &&
                    element[attribute].translations[lang] &&
                    element[attribute].translations[lang] !== "") {
                    return element[attribute].translations[lang];
                } else if (element[attribute] && element[attribute].translations) {
                    if (element[attribute].translations.fi) {
                        return element[attribute].translations.fi;
                    }
                    if (element[attribute].translations.sv) {
                        return element[attribute].translations.sv;
                    }
                    if (element[attribute].translations.en) {
                        return element[attribute].translations.en;
                    }
                } else {
                    return undefined;
                }
            }
            return "";
        };

    });
