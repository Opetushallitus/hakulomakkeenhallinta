'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', '$location', 'Resources', 'HH', 'ASFResource', 'ASForms',
        function($scope, $modal, $log, $location, Resources, HH, ASFResource, ASForms) {

            $scope.question = {};
            $scope.selectedApplicationSystems = [];
            $scope.applicationForms = [];
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

//            $scope.applicationForms = ASFResource.query();
            ASForms.haeHakulomakkeet.get().$promise.then(function(data){
                $scope.applicationForms = data;
            });

            $scope.luoHakulomake = function() {
                $modal.open({
                    templateUrl: 'partials/lomake/liita-haku-lomakkeeseen.html',
                    controller: 'CreateapplicationsystemformCtrl'
                }).result.then(function(result) {
                    ASFResource.save(result);
                    $scope.applicationForms = ASFResource.query();
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
                ASFResource.delete(_.pick(element, '_id'));
                $scope.applicationForms.splice(index, 1);
            };

            $scope.toggleCheck = function(applicationForm) {
                $scope.applicationForm = applicationForm;
            };
        }
    ]);
