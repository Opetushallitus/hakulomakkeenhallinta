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

            ASForms.query().$promise.then(function success(data){
                $scope.applicationForms = data;
            }, function error(error){
                //TODO: tähän virhetilanteen käsittely
                console.dir(error);
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
                ASForms.delete({_id: element._id},
                    function success(resp){
                        //TODO: tähän mahdollinen käsittely
                        //poistetaan rivi UI:sta
                        $scope.applicationForms.splice(index, 1);
                    },
                    function error(error){
                        //TODO: tähän tämän tilanteen käsittely
                        console.log('Poisto ei onnistunut: ', error);
                    }
                );
            };

            $scope.toggleCheck = function(applicationForm) {
                $scope.applicationForm = applicationForm;
            };
        }
    ]);
