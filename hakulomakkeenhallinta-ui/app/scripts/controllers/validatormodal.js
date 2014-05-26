'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')

.controller('ValidatorModalCtrl', ['$scope',
    function($scope) {
        $scope.types = {
            'Pakollinen': 'RequiredFieldValidator'
        };
    }
]);
