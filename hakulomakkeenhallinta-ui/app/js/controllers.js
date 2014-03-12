'use strict';

/* Controllers */

var controllers = angular.module('hakulomakkeenhallinta.controllers', []);

controllers.controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', '$location', 'Resources', 'AS', function ($scope, $modal, $log, $location, Resources, AS) {
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
    $scope.applicationForms = AS.listApplicationsystems(); 

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
            $location.path("hakulomakkeet/" + applicationForm._id + '/' + applicationOptionId);
        }, function () {

        });
    };
    $scope.toggleCheck = function (applicationForm) {
        $scope.applicationForm = applicationForm;
    };
}]);

controllers.controller('QuestionsCtrl', ['$scope', '$modal', '$log', '$location', 'Resources', function ($scope, $modal, $log, $location, Resources) {
    console.log('QuestionsCtrl');
    $scope.addNewAdditionalQuestion = function (applicationSystem) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
            controller: 'ModalApplicationOptionCtrl2',
            resolve: {
                applicationSystem: function () {
                    return applicationSystem;
                }
            }
        }).result.then(function (applicationOptionId) {
            console.log("ok " + applicationOptionId);
            console.log("ok " + "");
            $location.path("applicationSystemForm/" + applicationSystem._id + '/' + applicationOptionId);
        }, function () {

        });
    };
}]);

controllers.controller('ModalApplicationOptionCtrl2', ['$scope', '$location', 'Resources', '$modalInstance', 'applicationSystem', 'AS',  function ($scope, $location, Resources, $modalInstance, applicationSystem, AS) {
    $scope.applicationOptions = [];
    $scope.queryParameters = {};
    
    
    $scope.ok = function () {
        $modalInstance.close(this.applicationOption.id);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.search = function () {
        $scope.applicationOptions = AS.getApplicationOptions(applicationSystem._id, $scope.queryParameters.term); 
    };
}]);

controllers.controller('BackCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.back = function () {
        var path = $location.path().split("/");
        path.pop();
        $location.path(path.join('/'));
    };
    $scope.goto = function (path) {
        $location.path($location.path() + '/' + path._id);
    }
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

var ModalApplicationOptionCtrl = function ($scope, $modalInstance, Resources, ApplicationSystem) {
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
var QuestionTypeCtrl = function ($scope, $modalInstance, Resources, $routeParams, applicationSystem) {
    
    var formWalker = _.walk(function(e) {
      return e.children;
    });

    $scope.themes = formWalker.filter(applicationSystem.form, _.walk.preorder, function(el) {
        console.log(_.omit(el, 'children', 'validators')); 
        return el._class && el._class.indexOf("Theme") != -1;
    }); 

    $scope.types = Resources.types.query($scope.queryParameters);

    $scope.ok = function () {
        $modalInstance.close({element: this.element, type: this.type});
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
    $scope.question.parent = $scope.data.element._id;

    $scope.ok = function () {
        $modalInstance.close(this.question);
    };

    $scope.back = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.addNewTranslation = function () {
        alert('Not implemented!' + $scope.languages.length);
    };

};


controllers.controller('AdditionalQuestionsCtrl', 
        ['$scope', '$modal', '$log', '$location', 'Resources', '$routeParams', '$http',
        function ($scope, $modal, $log, $location, Resources, $routeParams, $http) {

    $scope.organization = {'name' : {'translations' : {'fi' : 'k-kauppa'}}}; 
    $scope.applicationSystem = Resources.applicationSystem.get();
    $scope.additionalQuestions = Resources.additionalQuestions.query($routeParams);
    $scope.addQuestion = function ( applicationSystem) {
        $modal.open({
            templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
            controller: QuestionTypeCtrl,
            resolve: {
                applicationSystem: function () {
                    return $scope.applicationSystem;
                }
            }
        }).result.then(function (data) {
                $scope.data = data;
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                    controller: QuestionCtrl,
                    scope: $scope
                }).result.then(function (question) {
                    console.log("Tallennetaan kysymys " + JSON.stringify(question));
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

controllers.controller('ApplicationSystemCtrl', ['$scope', 'Resources', '_', function ($scope, Resources, _) {
    $scope.tree = Resources.applicationSystem.get();

    $scope.delete = function (array, index) {
        array.splice(index, 1);
    };
    $scope.modify = function (element, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        alert("modify " + element._id);
    };

    $scope.expr2str = function (expr) {
        return "test";
        if (expr._class) {
            var oper = expr._class.split('.').pop()
            if (oper == 'Variable') {
                return expr.value;
            } else if (oper == 'Value') {
                return '\'' + expr.value + '\'';
            } else if (oper == 'Not') {
                return ' (' + oper.toLowerCase() + ' ' + this.expr2str(expr.left) + ")";
            } else if (oper == 'Equals') {
                return '(' + this.expr2str(expr.left) + ' = ' + this.expr2str(expr.right) + ')';
            }
            return '(' + this.expr2str(expr.left) + ' ' + oper.toLowerCase() + ' ' + this.expr2str(expr.right) + ')';
        } else {
            return '';
        }
    };

    $scope.createAdditionalQuestions = function (element) {

    };

    $scope.release = function (element) {
        pprint = function(element) {
            console.log(element._id);
        }
    };



}]);
//controllers.controller('ModalInstanceCtrl', ['$scope', '$modal', 'items', ModalInstanceCtrl]);
