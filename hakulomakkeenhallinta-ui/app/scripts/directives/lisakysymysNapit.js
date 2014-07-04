'use strict';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('lisakysymysNapit', function () {
        return{
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/lisakysymys-napit.html',
            link: function($scope, elem, attrs){
                $scope.click = function(){
                    if($scope.editFlag){
                        $scope.tallennaMuokkaus();
                    }else{
                        $scope.tallennaUusi();
                    }
                }
            }
        }
    });