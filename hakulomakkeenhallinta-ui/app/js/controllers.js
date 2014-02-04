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
    $scope.ok = function () {
        var result = {
            applicationFormTemplateId: this.applicationFormTemplate.id,
            applicationSystemId: this.applicationSystem.id
        };
        console.log(result);
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
    $scope.question.validators = {}
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
    };
    $scope.sortQuestions = function () {
        $modal.open({
            templateUrl: 'partials/lisakysymykset/sort-questions.html',
            controller: SortQuestionsCtrl
        });
    };
}]);
var SortQuestionsCtrl = function ($scope, $modalInstance, Resources) {
    $scope.first = true;
    $scope.last = true;

    $scope.themes = Resources.themes.query($scope.queryParameters);
    $scope.additionalQuestions = Resources.additionalQuestions.query($scope.queryParameters);
    $scope.ok = function () {
        console.log($scope.additionalQuestions);
        $modalInstance.close(this.question);
    };

    $scope.cancel = function () {
        console.log("SortQuestionsCtrl cancel");
        $modalInstance.dismiss('cancel');
    };
    $scope.updateButtons = function () {
        $scope.first = $scope.additionalQuestions.indexOf(this.additionalQuestion) == 0;
        $scope.last = $scope.additionalQuestions.indexOf(this.additionalQuestion) == $scope.additionalQuestions.length - 1;
    }

    $scope.select = function () {
        $scope.updateButtons()
        $scope.additionalQuestion = this.additionalQuestion;
    };

    $scope.up = function () {
        console.log("SortQuestionsCtrl up");
        $scope.move('up');

    };
    $scope.move = function () {
        var index = $scope.additionalQuestions.indexOf(this.additionalQuestion);
        var tmp = $scope.additionalQuestions[index];
        $scope.additionalQuestions[index] = $scope.additionalQuestions[index + 1];
        $scope.additionalQuestions[index + 1] = tmp;
        $scope.updateButtons();
    }

    $scope.down = function () {
        console.log("SortQuestionsCtrl down");
        move('down');
        updateButtons()
    };

};

controllers.controller('DropdownCtrl', ['$scope', function ($scope) {
    $scope.items = [
        "Tarkastele",
        "Tee hakukohtaisia lisäkysymyksiä",
        "Näytä hakukohteet",
        "Kopio uudeksi",
        "Julkaise",
        "(Peruuta julkaisu)"
    ];
}]);
controllers.controller('TreeCtrl', ['$scope', function ($scope) {
    $scope.items = [
        "Tarkastele",
        "Tee hakukohtaisia lisäkysymyksiä",
        "Näytä hakukohteet",
        "Kopio uudeksi",
        "Julkaise",
        "(Peruuta julkaisu)"
    ];
}]);

controllers.controller('FormCtrl', ['$scope', 'Resources', function ($scope, Resources) {
    $scope.tree = Resources.form.get();
//    $scope.add_child = function (parent_node, title) {
//        var child_node = {'title': title};
//
//        if (parent_node.children) {
//            parent_node.children.push(child_node);
//        }
//        else {
//            parent_node.children = [child_node];
//        }
//    };
}]);
//controllers.controller('ModalInstanceCtrl', ['$scope', '$modal', 'items', ModalInstanceCtrl]);