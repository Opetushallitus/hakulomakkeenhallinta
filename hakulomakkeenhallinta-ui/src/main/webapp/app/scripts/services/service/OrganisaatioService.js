'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('OrganisaatioService',
    function ($rootScope, $modal, $route) {
        /**
         * avataam dialogi uuden ryhmän luomiseksi organisaatio palveluun
         * @param kayttoTarkoitus ryhmän kayttö tarkoitus
         * @organisaatioOid käyttäjän organisaation Oid
         */
        this.lisaaUusiRyhma = function (haku, kayttoTarkoitus, organisaatioOid) {
            $rootScope.LOGS('OrganisaatioService', 'lisaaUusiRyhma()', kayttoTarkoitus);
            $modal.open({
                templateUrl: 'partials/dialogs/lisaa-ryhma-dialog.html',
                controller: 'LisaaRyhmaDialogCtrl',
                resolve: {
                    haku: function () {
                        return haku;
                    },
                    kayttoTarkoitus: function () {
                        return kayttoTarkoitus;
                    },
                    organisaatioOid: function () {
                        return organisaatioOid;
                    }
                }
            }).result.then(
                function () {
                    //ladaan sivu uudelleen onnistuneiden muutosten jälkeen
                    $route.reload();
                }
            );
        };
    }
);
