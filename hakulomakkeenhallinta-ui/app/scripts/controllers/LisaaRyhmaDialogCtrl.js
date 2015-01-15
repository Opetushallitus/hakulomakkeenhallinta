'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaRyhmaDialogCtrl',
    function ($rootScope, $scope, $modalInstance, kayttoTarkoitus, organisaatioOid, Organisaatio) {
        $scope.kayttoTarkoitus = kayttoTarkoitus;
        $scope.organisaatioOid = organisaatioOid;

        $scope.talennaRyhma = function () {
            var ryhma = {};
            ryhma.nimi = {};
            ryhma.nimi.fi = $scope.nimiFI;
            ryhma.nimi.sv = $scope.nimiSV;
            ryhma.nimi.en = $scope.nimiEN;
            ryhma.kuvaus2 = {};
            ryhma.kuvaus2.fi = $scope.kuvausFI;
            ryhma.kuvaus2.sv = $scope.kuvausSV;
            ryhma.kuvaus2.en = $scope.kuvausEN;
            ryhma.kayttoTarkoitus = kayttoTarkoitus;
            console.log('^^^*****^^ ', ryhma);
            Organisaatio.lisaaRyhmaOrganisaatioPalveluun(ryhma).then(
                function (data) {
                    console.log('***** ', data);
                }
            );

/*          nimi : {
                fi : "Hanuri",
                sv : "Hanuri på svenska",
                en : "Hanuri in english"
            } ,
            kuvaus2 : {
                    kieli_fi#1: "Hanurin kuvaus",
                    kieli_sv#1: "Beskrivning av hanuri",
                    kieli_en#1 : "Description of hanuri"
            }*/
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
);
