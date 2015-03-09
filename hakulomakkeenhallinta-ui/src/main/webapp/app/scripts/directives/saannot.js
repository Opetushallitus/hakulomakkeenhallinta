angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('saannot',
    function($rootScope, $modal, $route, NavigationTreeStateService, OrganisaatioService, Organisaatio) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/saannot.html',
            scope: {
                applicationForm: '=applicationForm',
                ryhmat: '=ryhmat',
                lomakepohja: '=lomakepohja',
                userLang: '@userLang',
                ryhmaTyyppi: '@ryhmaTyyppi',
                nodeName: "@nodeName"

            },
            link: function($scope) {
                $scope.naytaLista = function() {
                    return NavigationTreeStateService.showNode($scope.nodeName)
                }

                $scope.toggleLista = function() {
                    return NavigationTreeStateService.toggleNodeState($scope.nodeName)
                }

                $scope.lisaaRyhmaAsetuksiin = function() {
                    $modal.open({
                        templateUrl: 'partials/dialogs/lisaa-ryhma-lomakkeen-asetuksiin-dialog.html',
                        controller: 'LisaaRyhmaLomakkeenAsetuksiinDialogCtrl',
                        scope: $scope,
                        resolve: {
                            applicationForm: function() {
                                return $scope.applicationForm
                            },
                            ryhmat: function() {
                                return $scope.ryhmat
                            },
                            lomakepohja: function() {
                                return $scope.lomakepohja
                            },
                            ryhmaTyyppi: function() {
                                return $scope.ryhmaTyyppi
                            }
                        }
                    }).result.then(
                        function() {
                            $route.reload()
                        }
                    )
                }

                $scope.lisaaRyhmaOrganisaatioPalveluun = function () {
                    OrganisaatioService.lisaaUusiRyhma($scope.ryhmatyyppi, Organisaatio.getUserSelectedOrganisation().oid)
                }
            }
        }
    })