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
                } else if (haku.nimi) {
                    if (haku.nimi.kieli_fi) {
                        return haku.nimi.kieli_fi;
                    }
                    if (haku.nimi.kieli_sv) {
                        return haku.nimi.kieli_sv;
                    }
                    if (haku.nimi.kieli_en) {
                        return haku.nimi.kieli_en;
                    }
                    return undefined;
                } else {
                    return undefined;
                }
            }
            return "";
        };
    });