'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectThemeAndQuestionTypeCtrl', function($scope, $rootScope, $modalInstance, FormEditor) {

        $rootScope.LOGS('selectThemeAndQuestion ',6);
        $scope.types;
        /**
         * haetaan kysymys tyypit HH:n tausta järjestelmästä
         */
        FormEditor.getQuestionTypes().then(function(data){
            $scope.types = data;
        });

        $scope.ok = function() {
            $modalInstance.close({
                type: this.type
            });
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
