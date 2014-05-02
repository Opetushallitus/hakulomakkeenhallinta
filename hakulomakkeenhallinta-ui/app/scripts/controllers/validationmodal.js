'use strict';

angular.module('hakulomakkeenhallintaUiApp')

.controller('ValidatorModalCtrl', ['$scope',
    function($scope) {
        $scope.types = {
            'Pakollinen': 'RequiredFieldValidator'
        };
    }
]);
