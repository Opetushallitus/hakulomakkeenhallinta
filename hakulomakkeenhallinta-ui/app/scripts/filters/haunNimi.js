'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('haunNimi', function () {
        return function (haku, userLang) {
            if (haku) {
                if (!userLang) {
                    userLang = 'fi';
                }
                var kieli = 'kieli_' + userLang;
                if (haku.nimi && haku.nimi[kieli]) {
                    return haku.nimi[kieli];
                } else {
                    if (haku.nimi && userLang === 'fi') {
                        return haku.nimi['kieli_sv'];
                    } else if (haku.nimi && userLang === 'sv') {
                        return haku.nimi['kieli_fi'];
                    }
                    return undefined;
                }
            }
            return "";
        };
    });