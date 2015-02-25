'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('languageTab', function () {
        return function(language, userLang) {
            if (language) {
                if (!userLang) {
                    userLang = 'fi';
                }
                if (language.translations && language.translations[userLang]) {
                    return language.translations[userLang].toLowerCase();
                } else if (language.translations) {
                    if (language.translations.fi) {
                        return language.translations.fi;
                    }
                    if (language.translations.sv) {
                        return language.translations.sv;
                    }
                    if (language.translations.en) {
                        return language.translations.en;
                    }
                    return undefined;
                }else {
                    return undefined;
                }
            }
            return "";
        };
    });
