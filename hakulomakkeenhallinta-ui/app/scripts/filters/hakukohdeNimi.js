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
                }else if(hakukohde.hakukohteenNimi){
                    return hakukohde.hakukohteenNimi;
                }else if(hakukohde.nimi && hakukohde.nimi[userLang]){
                    return hakukohde.nimi[userLang];
                }else {
                    return undefined;
                }
            }
            return "";
        };
    });