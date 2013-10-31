'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', 'Resources', function ($scope, $modal, $log, Resources) {
    $scope.selections = [];
    $scope.question = {};
    $scope.selectedApplicationSystems = [];
    $scope.languages = [
        {title: "Suomi"},
        {title: "Ruotsi"},
        {title: "Englanti", active: true}
    ];
    $scope.items = [
        {id: '1', name: 'Aasian tutkimus'},
        {id: '2', name: 'Aasian tutkimus, kandidaatinopinnot'}
    ];

    $scope.applicationSystems = Resources.applicationForms.query();

    $scope.luoHakulomake = function () {
        $modal.open({
            templateUrl: 'partials/lomake/liita-haku-lomakkeeseen.html',
            controller: liitaHakuLomakkeeseenCtrl
        }).result.then(function (data) {
                $scope.applicationSystems = Resources.applicationForms.query();
        });
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
                        controller: ModalInstanceCtrl
                    })
                });
        }, function () {

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
var liitaHakuLomakkeeseenCtrl = function ($scope, $modalInstance, Resources) {
    $scope.applicationSystems = Resources.applicationSystems.query();
    $scope.applicationFormTemplates = Resources.applicationFormTemplates.query();
    $scope.applicationFormTemplate = $scope.applicationFormTemplates[1];
    $scope.applicationSystem = $scope.applicationSystems[1];
    $scope.ok = function () {
        var result = {
            applicationFormTemplateId: this.applicationFormTemplateId,
            applicationSystemId: this.applicationSystem.id
        };
        Resources.applicationForms.save(result);
        $modalInstance.close(result);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var ModalInstanceCtrl = function ($scope, $modalInstance) {
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