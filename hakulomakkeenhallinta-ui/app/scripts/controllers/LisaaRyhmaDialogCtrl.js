'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaRyhmaDialogCtrl',
    function ($rootScope, $scope, $modalInstance, kayttoTarkoitus, organisaatioOid, Organisaatio, LocalisationService, AlertMsg) {
        $scope.kayttoTarkoitus = kayttoTarkoitus;
        $scope.organisaatioOid = organisaatioOid;
        $scope.infoMsg = '';

        Organisaatio.checkOrganisaatioAuth().then(
            function succes(data) {
                $rootScope.LOGS('LisaaRyhmaDialogCtrl', 'checkOrganisaatioAuth()', data);
            },
            function error(resp) {
                $rootScope.LOGS('LisaaRyhmaDialogCtrl', 'checkOrganisaatioAuth()', 'ei onnistu', resp);
                AlertMsg($scope, 'warning', 'warning.autenkikaatio.ei.onnistunut.tai.puutuvat.oikeudet');
            }
        );
        switch (kayttoTarkoitus) {
            case 'hakukohde_priorisoiva':
                $scope.infoMsg = 'lisaamassa.priorisoivan.hakukohderyhman';
                break;
            case 'hakukohde_rajaava':
                $scope.infoMsg = 'lisaamassa.rajaavan.hakukohderyhman';
                break;
        };
        $scope.nimiSyotetty = function () {
            if ($scope.ryhmanNimi.$dirty) {
                if ($scope.ryhmanNimi.nimifi.$viewValue !== '' ||
                    $scope.ryhmanNimi.nimisv.$viewValue !== '' ||
                    $scope.ryhmanNimi.nimien.$viewValue !== '') {
                    $scope.nimiDefined = true;
                } else {
                    $scope.nimiDefined = false;
                }
            }
        };

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

            Organisaatio.lisaaRyhmaOrganisaatioPalveluun(ryhma).then(
                function success (data) {
                    $modalInstance.close();
                },
                function error (resp){
                    $rootScope.LOGS('LisaaRyhmaDialogCtrl', 'talennaRyhma()', resp);
                    AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
                }
            );
        };
        $scope.t = function (key) {
            return LocalisationService.tl(key);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
);