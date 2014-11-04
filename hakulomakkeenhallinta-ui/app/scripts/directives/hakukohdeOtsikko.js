'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeOtsikko', [ 'TarjontaAPI', 'Organisaatio', '$filter',
        function (TarjontaAPI, Organisaatio, $filter) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/puun-juuri-otsikko.html',
            controller: function ($scope) {
                $scope.naytaHakukohteet = false;
                $scope.hakukohdePoistettu = false;
                $scope.naytaMaara = false;
/*                console.log('** ', $scope.hakukohdeOid);
                console.log('** ', $scope.teemat);

                if ($scope.teemat !== undefined) {
                    console.log('## ', $scope.teemat);
                    console.log('## ', Object.keys($scope.teemat)[0]);
                    console.log('## ', $scope.teemat[Object.keys($scope.teemat)[0]][0].targetIsGroup);
                }*/

                if($scope.teemat[Object.keys($scope.teemat)[0]][0].targetIsGroup) {
                    Organisaatio.getOrganisationData($scope.hakukohdeOid).then(
                        function (data) {
                            if (data.oid) {
                                $scope.hakukohdeInfo = data;
                            } else {
                                $scope.hakukohdePoistettu = true;
                                $scope.hakukohdeInfo = {};
                                $scope.hakukohdeInfo.nimi = {
                                    fi: 'HAKUKOHDE RYHMÄ POISTETTU',
                                    sv: 'HAKUKOHDE RYHMÄ POISTETTU',
                                    en: 'HAKUKOHDE RYHMÄ POISTETTU'
                                };
                            }
                            $scope.otsikko = $filter('hakukohdeNimi')($scope.hakukohdeInfo, $scope.userLang);
                        }
                    );
                } else {
                    TarjontaAPI.fetchHakukohdeInfo($scope.hakukohdeOid).then(
                        function (data) {
                            if (data === 'NOT_FOUND') {
                                $scope.hakukohdePoistettu = true;
                                $scope.hakukohdeInfo = {};
                                $scope.hakukohdeInfo.nimi = {
                                    fi: 'HAKUKOHDE POISTETTU',
                                    sv: 'HAKUKOHDE POISTETTU',
                                    en: 'HAKUKOHDE POISTETTU'
                                };
                            } else {
                                $scope.hakukohdeInfo = data;
                            }
                            $scope.otsikko = $filter('hakukohdeNimi')($scope.hakukohdeInfo, $scope.userLang);
                        }
                    );
                }
                $scope.hakukohdeMaara = 0;
                /*if (teema.hkkohde !== undefined && teema.hkkohde.length > 0) {
                 $scope.hakukohdeMaara = teema.hkkohde.length;
                 }*/


                /**
                 * näyttää / piilottaa teeman alla olevat hakukohteet
                 */
                $scope.toggleNaytaHakukohteet = function () {
                    $scope.naytaHakukohteet = !$scope.naytaHakukohteet;
                };
                /**
                 * näyttää / piilottaa kaikki hakukohteessa olevat kysymykset
                 * lähettää arvon lapsi $scope:ssa olevalle kuuntelijalle
                 */
                $scope.showAllQuestions = function () {
                    if (!$scope.naytaHakukohteet) {
                        $scope.toggleNaytaHakukohteet();
                    }
                    $scope.$broadcast('SHOW_HIDE_ALL_QUESTION');
                };

            }
        };

    }]);