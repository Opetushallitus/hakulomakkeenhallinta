'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('hakukohdeNimi', function () {
        return function(hakukohde, userLang) {
            if (hakukohde) {
                if (!userLang) {
                    userLang = 'fi';
                }
                var kieli = 'kieli_'+userLang;
                if ( hakukohde.hakukohteenNimet && hakukohde.hakukohteenNimet[kieli]) {
                    return hakukohde.hakukohteenNimet[kieli];
                }else{
                    return undefined;
                }
            }
            return "";
        };
    });