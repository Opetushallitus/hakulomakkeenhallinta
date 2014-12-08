'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('hakukohdeNimi', function () {
        return function(hakukohde, userLang) {
            if (hakukohde) {
                if (!userLang) {
                    userLang = 'fi';
                }

                var kieli = 'kieli_' + userLang;
                if (hakukohde.hakukohteenNimet && hakukohde.hakukohteenNimet[kieli]) {
                    return hakukohde.hakukohteenNimet[kieli];
                } else if (hakukohde.hakukohteenNimi) {
                    return hakukohde.hakukohteenNimi;
                } else if (hakukohde.nimi && hakukohde.nimi[userLang]) {
                    return hakukohde.nimi[userLang];
                } else if (hakukohde.nimi) {
                    if (hakukohde.nimi.fi) {
                        return hakukohde.nimi.fi;
                    }
                    if (hakukohde.nimi.sv) {
                        return hakukohde.nimi.sv;
                    }
                    if (hakukohde.nimi.en) {
                        return hakukohde.nimi.en;
                    }
                } else {
                    return undefined;
                }
            }
            return "";
        };
    });