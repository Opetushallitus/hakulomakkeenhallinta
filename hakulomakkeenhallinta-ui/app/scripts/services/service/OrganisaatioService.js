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

        /*https://itest-virkailija.oph.ware.fi/organisaatio-service/rest/organisaatio
        {
            version : 0,
            parentOid : "1.2.246.562.10.00000000001",
            oid : null,
            tyypit : ["Ryhma"],
            ryhmatyypit : ["hakukohde"],
            kayttoryhmat : ["hakukohde_rajaava"],
            nimi : {
                fi : "Hanuri",
                sv : "Hanuri på svenska",
                en : "Hanuri in english"
            } ,
            kuvaus2 : {
                    kieli_fi#1: "Hanurin kuvaus",
                    kieli_sv#1: "Beskrivning av hanuri",
                    kieli_en#1 : "Description of hanuri"
            }
        }*/
    }
);
