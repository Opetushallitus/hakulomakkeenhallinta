'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectThemeAndQuestionTypeCtrl', function($scope, $modalInstance, ElementTypes) {
        $scope.types = ElementTypes.query();

        $scope.ok = function() {
            $modalInstance.close({
                type: this.type
            });
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
