'use strickt';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('osoite', [ 'Koodisto', 'Organisaatio', '$routeParams', '$filter',
        function (Koodisto, Organisaatio, $routeParams, $filter) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/osoite.html',
            scope: {
                address: '=address',
                userLang: '@userLang'
            },
            controller: function ($scope) {
                $scope.postiKoodit = {};

                /**
                 * haetaan postinumerot ja postitoimipaikat'
                 * Koodistosta
                 */
                Koodisto.getPostiKoodit().then(function (data) {
                    $scope.postiKoodit = data;
                });

                /**
                 * asettaa postitoimi paikan valitulla postinumerolla
                 */
                $scope.setPostitoimipaikka = function () {
                    var postikoodi = _.find($scope.postiKoodit, function (koodi) { return koodi.koodiArvo ===  $scope.address.postCode; });
                    $scope.address.postOffice =  _.find(postikoodi.metadata, function (meta) {return meta.kieli.toLowerCase() === $scope.userLang;}).nimi;
                };
                /**
                 * Esitätäytetään liitepyynnön palautus osoitteeksi käyttäjän organisaatiosta saatu postiosoite
                 * jos se on saatavilla.
                 */
                Organisaatio.getOrganisationData($routeParams.oid).then(
                    function (orgInfo) {
                        if (orgInfo.postiosoite) {
                            if (orgInfo.postiosoite.osoite && $scope.address.street === undefined) {
                                $scope.address.street = orgInfo.postiosoite.osoite;
                            }
                            if (orgInfo.postiosoite.postinumeroUri && $scope.address.postCode === undefined) {
                                $scope.address.postCode = orgInfo.postiosoite.postinumeroUri.slice(6);
                            }
                            if (orgInfo.postiosoite.postitoimipaikka && $scope.address.postOffice === undefined) {
                                $scope.address.postOffice = orgInfo.postiosoite.postitoimipaikka;
                            }
                        }
                    }
                );
            }
        };

    }]);