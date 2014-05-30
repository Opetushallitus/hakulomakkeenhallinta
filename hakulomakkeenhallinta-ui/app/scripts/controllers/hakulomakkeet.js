'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', '$location', 'HH', 'FormEditor',
        function($scope, $modal, $log, $location, HH, FormEditor) {

console.log('********* HakulomakkeetCtrl ---->');

//            $scope.question = {};
//            $scope.selectedApplicationSystems = [];
            /*$scope.languages = [{
                title: "Suomi",
                active: true
            }, {
                title: "Ruotsi"
            }, {
                title: "Englanti"
            }];
            $scope.items = [{
                id: '1',
                name: 'Aasian tutkimus'
            }, {
                id: '2',
                name: 'Aasian tutkimus, kandidaatinopinnot'
            }];*/

            $scope.applicationForms = FormEditor.query({'_path':'application-system-form'});

            $scope.luoHakulomake = function() {
                $modal.open({
                    templateUrl: 'partials/lomake/liita-haku-lomakkeeseen.html',
                    controller: 'CreateapplicationsystemformCtrl'
                }).result.then(function(result) {
                     //TODO: fix this
                    //ASFResource.save(result);
                    //$scope.applicationForms = ASForms.query();
                });
            };

            $scope.valitseOrganisaatio = function(applicationSystemForm) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/lisakysymykset/organisaation-valinta.html',
                    controller: 'SelectOrganisationCtrl',
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

            $scope.open = function(applicationSystemForm) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                    controller: 'ModalApplicationOptionCtrl',
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
                ASForms.delete({_id: element._id});
            };

            $scope.toggleCheck = function(applicationForm) {
                $scope.applicationForm = applicationForm;
            };
        }
    ]);
