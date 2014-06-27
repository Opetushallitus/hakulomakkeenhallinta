'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('languageTab', function () {
        return function(language, userLang) {
            if (language) {
                if (!userLang) {
                    userLang = 'fi';
                }
                if ( language.translations && language.translations[userLang]) {
                    return language.translations[userLang].toLowerCase();
                }else{
                    return undefined;
                }
            }
            return "";
        };
    });
