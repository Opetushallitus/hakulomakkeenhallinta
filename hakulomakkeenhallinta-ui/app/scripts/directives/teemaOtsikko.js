'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('teemaOtsikko', [ '$filter', function ($filter) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/puun-juuri-otsikko.html',
            controller: function ($scope) {
//                $scope.naytaLista = false;
                $scope.naytaLista = true;
                $scope.maara = 0;
                $scope.naytaMaara = true;
                $scope.otsikko = $filter('i18n')($scope.theme, 'name', $scope.userLang);
                /**
                 * näyttää / piilottaa otsikon alla olevan listan
                 */
                $scope.toggleLista = function () {
                    if ($scope.maara > 0) {
                        $scope.naytaLista = !$scope.naytaLista;
                    }
                };
                /**
                 * näyttää / piilottaa kaikki hakukohteessa olevat kysymykset
                 * lähettää arvon lapsi $scope:ssa olevalle kuuntelijalle
                 */
                $scope.showAllQuestions = function () {
                    if (!$scope.naytaLista) {
                        $scope.toggleLista();
                    }
                    $scope.$broadcast('SHOW_HIDE_ALL_QUESTION');
                };

                $scope.setHakukohdeMaara = function () {
                    $scope.maara += 1;
                }

            }
        };

    }]);