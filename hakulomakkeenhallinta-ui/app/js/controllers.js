'use strict';

/* Controllers */

var controllers = angular.module('hakulomakkeenhallinta.controllers', []);

controllers.controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', '$location', 'Resources', function ($scope, $modal, $log, $location, Resources) {


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

    $scope.applicationForms = Resources.applicationForms.query();
    $scope.luoHakulomake = function () {

        $modal.open({
            templateUrl: 'partials/lomake/liita-haku-lomakkeeseen.html',
            controller: liitaHakuLomakkeeseenCtrl
        }).result.then(function (result) {
                Resources.applicationForms.save(result, function (res) {
                    $scope.applicationForms = Resources.applicationForms.query();
                });
            });
    };
    $scope.open = function (applicationForm) {
        console.log(applicationForm);
        var modalInstance = $modal.open({
            templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
            controller: ModalApplicationOptionCtrl
        });
        modalInstance.result.then(function (applicationOptionId) {
            console.log(applicationOptionId);
            $location.path("hakulomakkeet/" + applicationForm.id + '/' + applicationOptionId);
        }, function () {

        });
    };
    $scope.toggleCheck = function (applicationForm) {
        $scope.applicationForm = applicationForm;
    };
}]);

controllers.controller('MallipohjatCtrl', ['$scope', '$i18next', function ($scope, $i18next) {
    $scope.changeLng = function (lng) {
        $i18next.options.lng = lng;
    };
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
        $modalInstance.close(result);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var ModalApplicationOptionCtrl = function ($scope, $modalInstance, Resources) {
    $scope.applicationOptions = [];
    $scope.queryParameters = {};
    $scope.ok = function () {
        $modalInstance.close(this.applicationOption.id);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.search = function () {
        $scope.applicationOptions = Resources.applicationOptions.query($scope.queryParameters);
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
var QuestionTypeCtrl = function ($scope, $modalInstance, Resources, $routeParams) {
    console.log($routeParams);
    $scope.themes = Resources.themes.query($scope.queryParameters);
    $scope.types = Resources.types.query($scope.queryParameters);

    $scope.ok = function () {
        $modalInstance.close({theme: this.theme, type: this.type});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

};
var QuestionCtrl = function ($scope, $modalInstance, Resources) {
    $scope.lang = "fi";
    $scope.languages = Resources.languages.query($scope.queryParameters);
    $scope.question = {};
    $scope.question.title = {};
    $scope.question.help = {};
    $scope.question.additionalHelp = {};
    $scope.question.attributes = {}
    $scope.question.type = $scope.data.type.id;

    $scope.ok = function () {
        console.log("OK");
        console.log($scope.question);
        $modalInstance.close(this.question);
    };

    $scope.back = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.addNewTranslation = function () {
        alert('Not implemented!' + $scope.languages.length);
    };

};
controllers.controller('AdditionalQuestionsCtrl', ['$scope', '$modal', '$log', '$location', 'Resources', '$routeParams', function ($scope, $modal, $log, $location, Resources, $routeParams) {
    $scope.additionalQuestions = Resources.additionalQuestions.query($routeParams);
    $scope.addQuestion = function () {
        $modal.open({
            templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
            controller: QuestionTypeCtrl
        }).result.then(function (data) {
                $scope.data = data;
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                    controller: QuestionCtrl,
                    scope: $scope
                }).result.then(function (question) {
                        console.log("Tallennetaan kysymys " + question);
                    });
            });
    };
    $scope.back = function () {
        $location.path("/");
    }
}]);
//controllers.controller('ModalInstanceCtrl', ['$scope', '$modal', 'items', ModalInstanceCtrl]);