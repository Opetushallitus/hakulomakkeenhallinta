'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('QuestionsCtrl', ['$scope', '$modal', '$log', '$location',
        function($scope, $modal, $log, $location) {

            $scope.addNewAdditionalQuestion = function(applicationSystemForm) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                    controller: 'ModalApplicationOptionCtrl',
                    resolve: {
                        applicationSystemForm: function() {
                            return applicationSystemForm;
                        }
                    }
                }).result.then(function(applicationOptionId) {
                    $location.path("additionalQuestion/" + applicationSystemForm._id + '/' + applicationOptionId);
                }, function() {

                });
            };
        }
    ]);
