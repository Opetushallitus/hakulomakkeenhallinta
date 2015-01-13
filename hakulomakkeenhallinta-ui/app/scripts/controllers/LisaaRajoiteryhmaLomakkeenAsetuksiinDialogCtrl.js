angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('LisaaRajoiteryhmaLomakkeenAsetuksiinDialogCtrl',
    function ($scope, $rootScope, Organisaatio, _, $routeParams, $modalInstance, applicationForm, rajoiteRyhmat, _, AlertMsg, ApplicationFormConfiguration, lomakepohja) {
        $scope.applicationForm = applicationForm;
        $scope.hakukohdeRyhmat = [];
        $scope.valittuRyhma = {};
        //näytetään lataus indikaattori dialogissa
        $scope.starLoad = true;
        Organisaatio.getRajaavatHakukohdeRyhmat($routeParams.oid).then(
            function (data) {
                var valittavissaOlevatRyhmat = [];
                var kaytossaOlevatOidit = _.pluck(rajoiteRyhmat, 'groupdId');
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
        $scope.lisaaRajoiteryhmaLomakkeenAsetuksiin = function () {
            var valittuHakukohdeRyhma = {};
            valittuHakukohdeRyhma.groupdId = $scope.hakukohderyhma.oid;
            valittuHakukohdeRyhma.type = 'MAXIMUM_NUMBER_OF';
            ApplicationFormConfiguration.lisaaRyhmaLomakepohjanAstuksiin($routeParams.id, valittuHakukohdeRyhma, lomakepohja).then(
                function success (data) {
                    console.log('***** lisaaRajoiteryhmaLomakkeenAsetuksiin ', data);
                    //TODO: tarkista tämä kun backend tukee tätä.
                    $modalInstance.close(valittuHakukohdeRyhma);
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
    }
);
