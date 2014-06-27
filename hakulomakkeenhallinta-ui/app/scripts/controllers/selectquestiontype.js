'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectQuestionTypeCtrl',
        function($scope, $rootScope, $modalInstance, FormEditor, applicationSystem, theme, hakukohde) {

        $rootScope.LOGS('SelectQuestionTypeCtrl');
        $scope.applicationSystem =  applicationSystem;
        $scope.theme = theme;
        $scope.hakukohde = hakukohde;
        $scope.types;
        /**
         * haetaan kysymys tyypit HH:n taustajärjestelmästä
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
