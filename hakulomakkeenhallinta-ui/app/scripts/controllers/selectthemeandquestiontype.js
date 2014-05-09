'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectThemeAndQuestionTypeCtrl', function($scope, $modalInstance, TypeResource, $routeParams, FormWalker, applicationSystem, ElementTypes) {

        $scope.themes = FormWalker.filterByType(applicationSystem.form, "Theme");
        $scope.types = ElementTypes.query();

        $scope.ok = function() {
            $modalInstance.close({
                theme: this.element,
                type: this.type
            });
        };
        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
