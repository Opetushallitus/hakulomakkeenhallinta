'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('userOrganisationSelect', [ 'Organisaatio', '$filter', '$location', '$routeParams', '$rootScope', '_',
        function (Organisaatio, $filter, $location, $routeParams, $rootScope, _) {
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
                        Organisaatio.setOrganisation(userOrg);
                        if ($location.path().indexOf('themeQuestionsByOrganisation') !== -1) {
                            $location.path("/themeQuestionsByOrganisation/" + $routeParams.id + '/' + Organisaatio.getUserSelectedOrganisation().oid);
                        }
                        if ($location.path().indexOf('applicationSystemFormConfigurations') !== -1) {
                            $location.path("/applicationSystemFormConfigurations/" + $routeParams.id + '/' + Organisaatio.getUserSelectedOrganisation().oid);
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
                                if ($location.path().indexOf('themeQuestionsByOrganisation') !== -1 ||
                                    $location.path().indexOf('applicationSystemFormConfigurations') !== -1) {
                                    if ($routeParams.oid !== undefined) {
                                        $scope.userOrg = _.findWhere($scope.userOrganisations, { oid: $routeParams.oid});
                                    }
                                } else {
                                    $scope.userOrg = $scope.userOrganisations[0];
                                }
                                Organisaatio.setUserSelectedOrganisation($scope.userOrg);
                                Organisaatio.setOrganisation($scope.userOrg);
                            }
                            $rootScope.LOGS('userOrganisationSelect', 'Selected org: ', Organisaatio.getUserSelectedOrganisation());
                        }
                    );
                }
            };
        }]);