'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetCtrl', ['$scope', '$rootScope', '$modal', '$log', '$location', 'FormEditor',
        function($scope, $rootScope, $modal, $log, $location, FormEditor ) {
            $rootScope.LOGS('HakulomakkeetCtrl');

            $scope.applicationForms = [];
            /**
             * haetaan hakulomakkeet lista
             */
            FormEditor.getApplicationSystemForms().then(
                function(data){
                    $scope.applicationForms = data;
                });

            $scope.luoHakulomake = function() {
                $modal.open({
                    templateUrl: 'partials/lomake/liita-haku-lomakkeeseen.html',
                    controller: 'CreateapplicationsystemformCtrl'
                }).result.then(function(result) {
                        //ei toteutusta vielä
                });
            };
            /**
             * avataan organisaation valinta dialogi valitulle hakulomakkeell
             * @param applicationSystemForm valittu hakulomake
             */
            $scope.valitseOrganisaatio = function(applicationSystemForm) {
                applicationSystemForm._id = '1.2.246.562.29.89709440708';
                $rootScope.LOGS('HakulomakkeetCtrl','valitseOrganisaatio()', applicationSystemForm);
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

/*
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
*/

            $scope.delete = function(element, index) {
                //ei toteutusta vielä
            };

            $scope.toggleCheck = function(applicationForm) {
                $scope.applicationForm = applicationForm;
            };
        }
    ]);
