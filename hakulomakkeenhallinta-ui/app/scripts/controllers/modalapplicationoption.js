'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')

.controller('ModalApplicationOptionCtrl', ['$scope', '$location', '$modalInstance', 'applicationSystemForm', 'HH',
    function($scope, $location, $modalInstance, applicationSystemForm, HH) {
        $scope.applicationOptions = [];
        $scope.queryParameters = {};
        $scope.applicationSystemForm = applicationSystemForm;
        $scope.ok = function() {
            $modalInstance.close(this.applicationOption.oid);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.search = function() {
            $scope.applicationOptions = HH.searchApplicationOptions(applicationSystemForm._id, $scope.queryParameters.term);
        };
    }
]);
