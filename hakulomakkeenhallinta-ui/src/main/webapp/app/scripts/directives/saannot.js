angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('saannot',
    function($rootScope, $modal, $route, NavigationTreeStateService, OrganisaatioService, Organisaatio, LocalisationService) {
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

                var groupNameKeys = {
                    hakukohde_rajaava: { key: 'hakukohderyhmien.hakukohteiden.rajaus', defaultValue: 'Rajaavat hakukohderyhmät' },
                    hakukohde_priorisoiva: { key: 'hakukohderyhmine.hakukohteiden.priorisointi', defaultValue: 'Priorisoivat hakukohderyhmät'},
                    hakukohde_liiteryhma: { key: 'hakukohderyhmien.liiteosoitteet', defaultValue: 'Liiteosoiteryhmät' }
                }
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

                $scope.lisaaRyhmaOrganisaatioPalveluun = function (ryhmaTyyppi) {
                    OrganisaatioService.lisaaUusiRyhma(ryhmaTyyppi, Organisaatio.getUserSelectedOrganisation().oid)
                }

                $scope.groupName = function () {
                    return LocalisationService.tl(groupNameKeys[$scope.ryhmaTyyppi].key) || groupNameKeys[$scope.ryhmaTyyppi].defaultValue
                }
            }
        }
    })