'use strict';
angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('TarjontaService',
    function ($modal, $rootScope, $route) {
        /**
         * avataam dialogi hakukohteiden lisäämiseksi hakukohderyhmään
         * näiden tietojen tallennus paikka on tarjonta
         * @param hakukohdeRyhma
         * @param userLang käyttäjän käyttökieli
         */
        this.lisaaHakukohdeRyhmaan = function (hakukohdeRyhma, userLang) {
            //TODO: poista logitukset kun ei tarvetta
            console.log('*** lisää hakukohde Ryhmään ***', hakukohdeRyhma, userLang);
            $modal.open({
                templateUrl: 'partials/dialogs/lisaa-hakukohde-ryhmaan-dialog.html',
                controller: 'LisaaHakukohdeRyhmaanDialogCtrl',
                size: 'lg',
                resolve: {
                    hakukohdeRyhma: function () {
                        return hakukohdeRyhma;
                    },
                    userLang: function () {
                        return userLang;
                    }
                }
            }).result.then(
                function (data) {
                    //TODO: poista logitukset kun ei tarvetta
                    console.log('*** ROUTE RELOAD hakukohde lisätty ryhmään ***', data);
                    $route.reload();
                }
            );
        };
        /**
         * avataan poisto dialogi poista hakukohde hakukohderyhmasta
         * näiden tietojen tallennus paikka on tarjonta
         * @param hakukohdeRyhma
         * @param hakukohde
         */
        this.poistaHakukohdeRyhmasta = function (hakukohdeRyhma, hakukohde) {
            $rootScope.LOGS('poistaHakukohdeRyhmasta', hakukohdeRyhma, hakukohde);
            $modal.open({
                templateUrl: 'partials/dialogs/poista-hakukohde-ryhmasta-dialog.html',
                controller: 'PoistaHakukohdeRyhmastaDialogCtrl',
                resolve: {
                    hakukohdeRyhma: function () {
                        return hakukohdeRyhma;
                    },
                    hakukohde: function () {
                        return hakukohde;
                    }
                }
            }).result.then(
                function () {
                    //TODO: poista logitukset kun ei tarvetta
                    console.log('*** hakukohde poistettu ryhmästä');
                    $route.reload();
                }
            );
        };
    }
);
