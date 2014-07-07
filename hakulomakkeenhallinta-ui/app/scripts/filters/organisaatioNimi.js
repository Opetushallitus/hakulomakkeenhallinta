'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('organisaatioNimi', function () {
        return function(organisaatio, userLang) {
            if (organisaatio) {
                if (!userLang) {
                    userLang = 'fi';
                }
                if ( organisaatio.nimi && organisaatio.nimi[userLang]) {
                    return organisaatio.nimi[userLang];
                }else if(organisaatio.nimi && organisaatio.nimi.fi){
                    return organisaatio.nimi.fi;
                } else {
                    return undefined;
                }
            }
            return "";
        };
    });
