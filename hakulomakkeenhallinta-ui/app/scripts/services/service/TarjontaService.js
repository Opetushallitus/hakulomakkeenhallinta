'use strict';
angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('TarjontaService',
    function ($modal, $rootScope) {
        /**
         * avataam dialogi hakukohteiden lisäämiseksi hakukohderyhmään
         * näiden tietojen tallennus paikka on tarjonta
         * @param hakukohdeRyhma
         */
        this.lisaaHakukohdeRyhmaan = function (hakukohdeRyhma) {
            console.log('*** lisää hakukohde Ryhmään ***', hakukohdeRyhma);
            $modal.open({
                templateUrl: 'partials/dialogs/lisaa-hakukohde-ryhmaan-dialog.html',
                controller: 'LisaaHakukohdeRyhmaanDialogCtrl',
                size: 'lg',
                resolve: {
                    hakukohdeRyhma: function () {
                        return hakukohdeRyhma;
                    }
                }
            }).result.then(
                function (data) {
                    console.log('*** hakukohde lisätty ryhmään ***', data);
                    //$route.reload();
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
                function (data) {
                    console.log('*** hakukohde poistettu ryhmästä');
                    //$route.reload();
                }
            );
        };
    }
);
