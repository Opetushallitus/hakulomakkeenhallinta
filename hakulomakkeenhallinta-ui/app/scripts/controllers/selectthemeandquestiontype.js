'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectThemeAndQuestionTypeCtrl', function($scope, $rootScope, $modalInstance, FormEditor) {

        $rootScope.LOGS('selectThemeAndQuestion '+6);
        $scope.types = FormEditor.query({'_path':'types'});

        $scope.ok = function() {
            $modalInstance.close({
                type: this.type
            });
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
