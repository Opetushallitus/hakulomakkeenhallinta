'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('kysymysOtsikko', function () {
        return function(otsikko, userLang) {
            if (otsikko.translations) {
                if (otsikko.translations[userLang]) {
                    return otsikko.translations[userLang];
                } else if (otsikko.translations.fi) {
                    return otsikko.translations.fi;
                } else if (otsikko.translations.sv) {
                    return otsikko.translations.sv;
                } else if (otsikko.translations.en) {
                    return otsikko.translations.en;
                }
            }
            return undefined;
        };
    });
