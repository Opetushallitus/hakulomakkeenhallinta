'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeRyhmaInfo', [ 'TarjontaAPI', '_', 'AlertMsg', 'ThemeQuestions', 'Organisaatio',
        function (TarjontaAPI, _, AlertMsg, ThemeQuestions, Organisaatio) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'partials/directives/hakukohde-ryhma-info.html',
                controller: function ($scope) {
                    $scope.naytaHakukohdeLista = false;
                    $scope.hakukohteidenMaara = 0;
                    $scope.hakukohdeRyhma = {};
                    Organisaatio.getOrganisationData($scope.rajoiteRyhma.groupId).then(
                        function (data) {
                            $scope.hakukohdeRyhma = data;
                        }
                    );
                    TarjontaAPI.haeRyhmanHakukohteet($scope.rajoiteRyhma.groupId).then(
                        function (data) {
                            $scope.hakukohteet = _.flatten( _.map(data.tulokset, function(tulokset) { return tulokset.tulokset; }));
                            $scope.hakukohteidenMaara = data.tuloksia;
                        }
                    );

                    $scope.toggleNaytaHakukohteet = function () {
                        $scope.naytaHakukohdeLista = !$scope.naytaHakukohdeLista;
                    }

                    $scope.tallennaHakukohdeRajaus = function (hakukohdeRyhmaOid, hakukohdeRajoite) {
                        //TODO: tähän tallenus kun back end valmis
                        if(hakukohdeRajoite !== undefined){
                            ThemeQuestions.tallennaHakukohderyhmaRajoite(hakukohdeRyhmaOid, hakukohdeRajoite).then(
                                function success(data) {
                                    AlertMsg($scope, 'success', 'tallennus.ok');
                                },
                                function error(resp) {
                                    AlertMsg($scope, 'error', 'error.tallennus.epaonnistui');
                                }
                            );

                        }
                    }
                }
            };

        }]);