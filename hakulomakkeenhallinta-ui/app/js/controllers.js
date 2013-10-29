'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
    $scope.question = {};
    $scope.selectedApplicationSystems = [];
    $scope.languages = [{title: "Suomi"}, {title: "Ruotsi"}, {title: "Englanti", active: true}];
    $scope.items = [{id: '1', name: 'Aasian tutkimus'},{id: '2', name: 'Aasian tutkimus, kandidaatinopinnot'}];
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
            controller: ModalInstanceCtrl,
            scope: $scope
        });
        modalInstance.result.then(function (selections) {
            $modal.open({
                templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                controller: ModalInstanceCtrl
            }).result.then(function (data) {
                    $modal.open({
                        templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                        controller: ModalInstanceCtrl,
                        dialogClass: 'modal myWindow'
                    })
                });
        }, function () {

        });
    };
    $scope.toggleCheck = function (item) {
        if ($scope.selectedApplicationSystems.indexOf(item) === -1) {
            $scope.selectedApplicationSystems.push(item);
        } else {
            $scope.selectedApplicationSystems.splice($scope.selections.indexOf(item), 1);
        }
    };
}]);

controllers.controller('MallipohjatCtrl', [function () {
}]);

var ModalInstanceCtrl = function ($scope, $modalInstance) {

    $scope.selections = [];


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