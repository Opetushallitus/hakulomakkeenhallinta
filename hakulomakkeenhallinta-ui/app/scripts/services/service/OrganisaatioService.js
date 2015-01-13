'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('OrganisaatioService',
    function ($modal) {
        /**
         * avataam dialogi uuden ryhmän luomiseksi organisaatio palveluun
         * @param kayttoTarkoitus ryhmän kayttö tarkoitus
         * @organisaatioOid käyttäjän organisaation Oid
         */
        this.lisaaUusiRyhma = function (kayttoTarkoitus, organisaatioOid) {
            console.log('*** lisää uusi ryhmä organisaatio palveluun ***', kayttoTarkoitus);
            $modal.open({
                templateUrl: 'partials/dialogs/lisaa-ryhma-dialog.html',
                controller: 'LisaaRyhmaDialogCtrl',
                resolve: {
                    kayttoTarkoitus: function () {
                        return kayttoTarkoitus;
                    },
                    organisaatioOid: function () {
                        return organisaatioOid;
                    }
                }
            });
        };
    }
);
