'use strict';

angular.module('hakulomakkeenhallintaUiApp')
    .controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', '$location', 'Resources', 'HH', 'ASFResource',
        function($scope, $modal, $log, $location, Resources, HH, ASFResource) {

            $scope.question = {};
            $scope.selectedApplicationSystems = [];
            $scope.languages = [{
                title: "Suomi"
            }, {
                title: "Ruotsi"
            }, {
                title: "Englanti",
                active: true
            }];
            $scope.items = [{
                id: '1',
                name: 'Aasian tutkimus'
            }, {
                id: '2',
                name: 'Aasian tutkimus, kandidaatinopinnot'
            }];

            $scope.applicationForms = ASFResource.query();

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

            $scope.toggleCheck = function(applicationForm) {
                $scope.applicationForm = applicationForm;
            };
        }
    ]);
