'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetCtrl', ['$scope', '$rootScope', '$modal', '$log', '$location', 'HH', 'FormEditor',
        function($scope, $rootScope, $modal, $log, $location, HH, FormEditor ) {
            $rootScope.LOGS('HakulomakkeetCtrl ',6);

            $scope.applicationForms = FormEditor.query({'_path':'application-system-form'});

            $scope.luoHakulomake = function() {
                $modal.open({
                    templateUrl: 'partials/lomake/liita-haku-lomakkeeseen.html',
                    controller: 'CreateapplicationsystemformCtrl'
                }).result.then(function(result) {
                        //ei toteutusta vielä
                });
            };

            $scope.valitseOrganisaatio = function(applicationSystemForm) {
                $rootScope.LOGS('HakulomakkeetCtrl ',22,' valitse organisaation ', applicationSystemForm);
                    $modal.open({
                    templateUrl: 'partials/lisakysymykset/organisaation-valinta.html',
                    controller: 'SelectOrganisationCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystemForm: function() {
                            return applicationSystemForm;
                        }
                    }
                });
            };

            $scope.open = function(applicationSystemForm) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                    controller: 'ModalApplicationOptionCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystemForm: function() {
                            return applicationSystemForm;
                        }
                    }
                });
                modalInstance.result.then(function(applicationOptionId) {
                    $location.path("additionalQuestion/" + applicationSystemForm._id + '/' + applicationOptionId);
                }, function() {

                });
            };

            $scope.delete = function(element, index) {
                //ei toteutusta vielä
            };

            $scope.toggleCheck = function(applicationForm) {
                $scope.applicationForm = applicationForm;
            };
        }
    ]);
