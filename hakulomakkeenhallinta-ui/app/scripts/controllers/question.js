'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')

.controller('QuestionCtrl', ['$scope', '$modal', '_',
    function($scope, $modal, _) {
        $scope.addValidator = function(validators) {
            $modal.open({
                templateUrl: 'partials/elements/edit/validators/new.html',
                controller: 'ValidatorModalCtrl'
            }).result.then(function(validator) {
                validators.push(validator);
            });
        };
    }
]);

