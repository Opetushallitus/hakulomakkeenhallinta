'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('userOrganisationSelect', [ 'Organisaatio', '$filter', '$location', '$routeParams', '$rootScope',
        function (Organisaatio, $filter, $location, $routeParams, $rootScope) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'partials/directives/user-organisation-select.html',
                controller: function ($scope) {
                    /**
                     * asetetaan käyttäjän valitsema organisaation ja
                     * vaihdetaan näkymään data siihen liittyen
                     * @param userOrg käyttäjän valitsema organisaatio
                     */
                    $scope.asetaOrganisaatio = function (userOrg) {
                        $rootScope.LOGS('userOrganisationSelect', userOrg.nimi);
                        Organisaatio.setUserSelectedOrganisation(userOrg);
                        if ($location.path().indexOf('themeQuestionsByOrganisation') !== -1) {
                            $location.path("/themeQuestionsByOrganisation/" + $routeParams.id + '/' + Organisaatio.getUserSelectedOrganisation().oid);
                        }
                    };
                    /**
                     * haetaan käyttäjän organisaatiot valintalistaan
                     */
                    Organisaatio.getUserOrganisations().then(
                        function (data) {
                            $scope.userOrganisations = $filter('orderBy')(data, 'nimi.' + $scope.userLang);

                            if (Organisaatio.getUserSelectedOrganisation().oid !== undefined) {
                                $scope.userOrg = Organisaatio.getUserSelectedOrganisation();
                            } else {
                                $scope.userOrg = $scope.userOrganisations[0];
                                Organisaatio.setUserSelectedOrganisation($scope.userOrganisations[0]);
                            }
                            $rootScope.LOGS('userOrganisationSelect', 'Selected org: ', Organisaatio.getUserSelectedOrganisation().nimi[$scope.userLang]);
                        }
                    );

                }
            };
        }]);