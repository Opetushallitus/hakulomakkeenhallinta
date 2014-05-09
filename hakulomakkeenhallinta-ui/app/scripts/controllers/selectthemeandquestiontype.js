'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectThemeAndQuestionTypeCtrl', function($scope, $modalInstance, TypeResource, $routeParams, FormWalker, applicationSystem, ElementTypes) {

        $scope.themes = FormWalker.filterByType(applicationSystem.form, "Theme");
        $scope.types = [];
//        TypeResource.query($scope.queryParameters);
        ElementTypes.query().$promise.then(
            function success(data){
                $scope.types = data;
            }, function error(error){
                //TODO: tämän käsittely
                console.log(error.data.message, error.status);
            }
        );

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
