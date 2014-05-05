'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectthemeandquestiontypeCtrl', function($scope, $modalInstance, TypeResource, $routeParams, FormWalker, applicationSystem) {

        $scope.themes = FormWalker.filterByType(applicationSystem.form, "Theme");
        $scope.types = TypeResource.query($scope.queryParameters);

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
