angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaRyhmaLomakkeenAsetuksiinDialogCtrl',
    function ($scope, $rootScope, Organisaatio, _, $routeParams, $modalInstance, haku, ryhmaTyyppi, applicationForm, ryhmat, AlertMsg, ApplicationFormConfiguration, lomakepohja, LocalisationService, TarjontaService, NavigationTreeStateService) {
        $scope.applicationForm = applicationForm;
        $scope.hakukohdeRyhmat = [];
        //näytetään lataus indikaattori dialogissa
        $scope.starLoad = true;

        Organisaatio.getHakukohdeRyhmat($routeParams.oid, ryhmaTyyppi).then(
            function (data) {
                var valittavissaOlevatRyhmat = [];
                // poistetaan valinta listasta jo lomakkeen asetuksissa käytössä olevat hakukohderyhmat
                var kaytossaOlevatOidit = _.pluck(ryhmat, 'groupId');
                _.each(data, function(ryhma) {
                    if(!_.contains(kaytossaOlevatOidit, ryhma.oid)) {
                        valittavissaOlevatRyhmat.push(ryhma);
                    }
                });
                $scope.$emit('LOADREADY');
                $scope.hakukohdeRyhmat = valittavissaOlevatRyhmat;
                if (valittavissaOlevatRyhmat.length === 0) {
                    AlertMsg($scope, 'warning', 'ei.valittavia.hakukohderyhmia.tai.ne.kaikki.ovat.jo.kaytossa');
                }
            }
        );
        /**
         * lisätään hakukohderyhmä lomakepohjan asetuksiin.
         */
        $scope.lisaaRyhmaLomakkeenAsetuksiin = function () {
            var valittuHakukohdeRyhma = {};
            valittuHakukohdeRyhma.groupId = $scope.hakukohderyhma.oid;
            valittuHakukohdeRyhma.type = ryhmaTyyppi;
            ApplicationFormConfiguration.lisaaRyhmaLomakepohjanAsetuksiin(haku, valittuHakukohdeRyhma).then(
                function success (data) {
                    NavigationTreeStateService.setNodeState(valittuHakukohdeRyhma.groupId, true);
                    $modalInstance.close();
                },
                function error (resp) {
                    AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
                }
            );
        };
        /**
         * Suljetaan dialogi
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.t = function (key) {
            return LocalisationService.tl(key);
        };
    }
);
