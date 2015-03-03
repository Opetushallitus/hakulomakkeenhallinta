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
                function () {
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
                    $route.reload();
                }
            );
        };
         /**
         * avataan poisto dialogi poista useita hakukohteita hakukohderyhmasta
         * näiden tietojen tallennus paikka on tarjonta
         * @param hakukohdeRyhma
         * @param hakukohteet ryhmässä olevat hakukohteet taulukko
         */
        this.poistaHakukohteitaRyhmasta = function (hakukohdeRyhma, ryhmanHakukohteet) {
            $rootScope.LOGS('poistaHakukohteitaRyhmasta', hakukohdeRyhma, ryhmanHakukohteet);
            $modal.open({
                templateUrl: 'partials/dialogs/poista-hakukohteita-ryhmasta-dialog.html',
                controller: 'PoistaHakukohteitaRyhmastaDialogCtrl',
                size: 'lg',
                resolve: {
                    hakukohdeRyhma: function () {
                        return hakukohdeRyhma;
                    },
                    ryhmanHakukohteet: function () {
                        return ryhmanHakukohteet;
                    }
                }
            }).result.then(
                function () {
                    $route.reload();
                }
            );
        };
    }
);
