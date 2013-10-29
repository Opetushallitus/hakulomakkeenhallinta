'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
    $scope.selections = [];
    $scope.applicationSystems = [
        {id: '1.1.1', name: 'Ensimmäinen haku'},
        {id: '1.1.2', name: 'Toinen haku'},
        {id: '1.1.3', name: 'Kolmas haku'}
    ];

    $scope.luoHakulomake = function () {
        alert('luoHakulomake()');
    };
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
            controller: ModalInstanceCtrl
        });
        modalInstance.result.then(function (selections) {
            $modal.open({
                templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                controller: ModalInstanceCtrl
            });
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.toggleCheck = function (item) {
        if ($scope.selections.indexOf(item) === -1) {
            $scope.selections.push(item);
        } else {
            $scope.selections.splice($scope.selections.indexOf(item), 1);
        }
    };
}]);

controllers.controller('MallipohjatCtrl', [function () {
}]);

var ModalInstanceCtrl = function ($scope, $modalInstance) {
    $scope.selections = [];
    $scope.items = [
        {id: '1', name: 'Aasian tutkimus'},
        {id: '2', name: 'Aasian tutkimus, kandidaatinopinnot'}
    ];

    $scope.ok = function () {
        $modalInstance.close($scope.selections);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.toggleCheck = function (item) {
        if ($scope.selections.indexOf(item) === -1) {
            $scope.selections.push(item);
        } else {
            $scope.selections.splice($scope.selections.indexOf(item), 1);
        }
    };
};

//controllers.controller('ModalInstanceCtrl', ['$scope', '$modal', 'items', ModalInstanceCtrl]);