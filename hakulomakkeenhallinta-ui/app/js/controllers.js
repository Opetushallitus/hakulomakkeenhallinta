'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
    $scope.selections = {};
    $scope.applicationSystems = [
        {id: '1.1.1', name: 'Ensimmäinen haku'},
        {id: '1.1.2', name: 'Toinen haku'},
        {id: '1.1.3', name: 'Kolmas haku'}
    ];

    $scope.luoHakulomake = function () {
        alert('luoHakulomake()');
    };
    $scope.open = function () {
        alert($scope.selections);
        var modalInstance = $modal.open({
            templateUrl: 'modalTest.html',
            controller: ModalInstanceCtrl,
            resolve: {
                items: function () {
                    return $scope.applicationSystems;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

controllers.controller('MallipohjatCtrl', [function () {
}]);

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

controllers.controller('ModalInstanceCtrl', ['$scope', '$modal', '$log', ModalInstanceCtrl]);