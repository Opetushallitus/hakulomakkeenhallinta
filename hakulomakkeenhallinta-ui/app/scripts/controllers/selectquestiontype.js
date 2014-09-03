'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectQuestionTypeCtrl',
        function($scope, $rootScope, $modalInstance, FormEditor, applicationSystem, theme, hakukohde, $filter) {

        $rootScope.LOGS('SelectQuestionTypeCtrl');
        $scope.applicationSystem =  applicationSystem;
        $scope.theme = theme;
        $scope.hakukohde = hakukohde;
        $scope.haunNimi = $filter('i18n')(applicationSystem, 'name', $scope.userLang);
        $scope.teema = $filter('i18n')(theme, 'name', $scope.userLang);
        $scope.hakukohdeNimi = $filter('hakukohdeNimi')(hakukohde, $scope.userLang);
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
