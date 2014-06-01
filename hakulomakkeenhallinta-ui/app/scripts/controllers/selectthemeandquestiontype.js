'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectThemeAndQuestionTypeCtrl', function($scope, $modalInstance, FormEditor) {

        console.log('***** selectThemeAndQuestion ***');
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
