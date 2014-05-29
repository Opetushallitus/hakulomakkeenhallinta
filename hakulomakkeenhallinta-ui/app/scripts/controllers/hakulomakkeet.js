'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', '$location', 'HH', 'ASForms',
        function($scope, $modal, $log, $location, HH, ASForms) {

console.log('********* HakulomakkeetCtrl ---->');

            $scope.question = {};
            $scope.selectedApplicationSystems = [];
            $scope.languages = [{
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
            }];

            $scope.applicationForms = ASForms.query({'_id':'application-system-form'});

            $scope.luoHakulomake = function() {
                $modal.open({
                    templateUrl: 'partials/lomake/liita-haku-lomakkeeseen.html',
                    controller: 'CreateapplicationsystemformCtrl'
                }).result.then(function(result) {
                    ASFResource.save(result);
                    $scope.applicationForms = ASForms.query();
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
