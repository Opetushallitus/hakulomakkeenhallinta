'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('organisaatioNimi', function () {
        return function(organisaatio, userLang) {
            if (organisaatio) {
                if (!userLang) {
                    userLang = 'fi';
                }
                if (organisaatio.nimi && organisaatio.nimi[userLang]) {
                    return organisaatio.nimi[userLang];
                } else if (organisaatio.nimi) {
                    if (organisaatio.nimi.fi) {
                       return organisaatio.nimi.fi;
                    }
                    if (organisaatio.nimi.sv) {
                       return organisaatio.nimi.sv;
                    }
                    if (organisaatio.nimi.en) {
                       return organisaatio.nimi.en;
                    }
                } else {
                    return undefined;
                }
            }
            return "";
        };
    });
