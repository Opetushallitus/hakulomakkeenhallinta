angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaPriorisoivaryhmaLomakkeenAsetuksiinDialogCtrl',
    function ($scope, $rootScope, Organisaatio, _, $routeParams, $modalInstance, applicationForm, priorisointiRyhmat, AlertMsg, ApplicationFormConfiguration, lomakepohja) {
        $scope.applicationForm = applicationForm;
        $scope.hakukohdeRyhmat = [];
        $scope.valittuRyhma = {};
        //näytetään lataus indikaattori dialogissa
        $scope.starLoad = true;
        console.log('*** ', priorisointiRyhmat);
        Organisaatio.getPriorisoivatHakukohdeRyhmat($routeParams.oid).then(
            function (data) {
                console.log('### ', data);
                var valittavissaOlevatRyhmat = [];
                // poistetaan valinta listasta jo lomakkeen asetuksissa käytössä olevat
                // hakukohderyhmat
                var kaytossaOlevatOidit = _.pluck(priorisointiRyhmat, 'oid');
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
        $scope.lisaaPriorisoivaryhmaLomakkeenAsetuksiin = function () {
            var valittuHakukohdeRyhma = {};
/*            ApplicationFormConfiguration.lisaaRyhmaLomakepohjanAsetuksiin($routeParams.id, valittuHakukohdeRyhma, lomakepohja).then(
                function success (data) {*/
                    console.log('***** lisaaPriorisointiryhmaLomakkeenAsetuksiin ', valittuHakukohdeRyhma);
                    $modalInstance.close(valittuHakukohdeRyhma);
               /* },
                function error (resp) {
                    AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
                }
            );*/
        };
        /**
         * Suljetaan dialogi
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
);
