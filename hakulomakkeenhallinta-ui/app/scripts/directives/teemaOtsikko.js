'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('teemaOtsikko', [ '$filter', function ($filter) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/puun-juuri-otsikko.html',
            controller: function ($scope) {
                $scope.naytaHakukohteet = false;
                $scope.hakukohdeMaara = 0;
                $scope.naytaMaara = true;
                $scope.otsikko = $filter('i18n')($scope.theme, 'name', $scope.userLang);
                /**
                 * näyttää / piilottaa teeman alla olevat hakukohteet
                 */
                $scope.toggleNaytaHakukohteet = function () {
                    if ($scope.hakukohdeMaara > 0) {
                        $scope.naytaHakukohteet = !$scope.naytaHakukohteet;
                    }
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

                $scope.setHakukohdeMaara = function () {
                    $scope.hakukohdeMaara += 1;
                }

            }
        };

    }]);