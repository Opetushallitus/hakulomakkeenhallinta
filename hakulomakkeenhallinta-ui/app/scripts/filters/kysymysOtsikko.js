'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('kysymysOtsikko', function () {
        return function(translations, userLang) {
            if (translations) {
                if (translations[userLang]) {
                    return translations[userLang];
                } else if (translations.fi) {
                    return translations.fi;
                } else if (translations.sv) {
                    return translations.sv;
                } else if (translations.en) {
                    return translations.en;
                }
            }
            return undefined;
        };
    });
