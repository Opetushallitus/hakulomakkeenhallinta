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
                    if ($scope.hakukohteet[$scope.hakukohdeOid] === undefined) {
                        $scope.hakukohdePoistettu = true;
                        $scope.hakukohdeInfo = {};
                        $scope.hakukohdeInfo.nimi = {
                            fi: 'HAKUKOHDE POISTETTU',
                            sv: 'HAKUKOHDE POISTETTU',
                            en: 'HAKUKOHDE POISTETTU'
                        };
                    } else {
                        $scope.hakukohdeInfo = $scope.hakukohteet[$scope.hakukohdeOid];
                    }
                    $scope.otsikko = $filter('hakukohdeNimi')($scope.hakukohdeInfo, $scope.userLang);
                }
                $scope.hakukohdeMaara = 0;
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
