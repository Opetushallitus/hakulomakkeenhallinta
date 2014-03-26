'use strict';

/* Controllers */

var controllers = angular.module('hakulomakkeenhallinta.controllers', []);

controllers.controller('AppCtrl', ['$scope', 'Resources', function ($scope, Resources) {
    $scope.accordionStates = {};
    $scope.languages = Resources.languages.query();
}]);


controllers.controller('ApplicationSystemFormCtrl', ['$scope', 'Resources', '$routeParams', '_', 'HH', function ($scope, Resources, $routeParams, _, HH) {
    $scope.applicationSystem = Resources.applicationSystem.get();

    $scope.delete = function (array, index) {
        array.splice(index, 1);
    };

    $scope.selectTemplate = function (type) {
        var t = type.split('.').pop();
        if (t === 'Theme' || t === 'RelatedQuestionComplexRule') {
            return t;
        }
        return "element";
    }
    $scope.expr2str = function (expr) {
        if (expr._class) {
            var oper = expr._class.split('.').pop();
            if (oper == 'Variable') {
                return expr.value;
            } else if (oper == 'Value') {
                return '\'' + expr.value + '\'';
            } else if (oper == 'Not') {
                return ' (' + oper.toLowerCase() + ' ' + this.expr2str(expr.left) + ")";
            } else if (oper == 'Equals') {
                return '(' + this.expr2str(expr.left) + ' = ' + this.expr2str(expr.right) + ')';
            } else if (oper == 'Or') {
                return '(' + this.expr2str(expr.left) + ' tai ' + this.expr2str(expr.right) + ')';
            } else if (oper == 'And') {
                return '(' + this.expr2str(expr.left) + ' ja ' + this.expr2str(expr.right) + ')';
            } else if (oper == 'Regexp') {
                return '\'' + expr.value + '=' + expr.pattern + '\'';
            }

            return "Unimplemented operator " + oper;
        } else {
            return '';
        }
    };

}]);


controllers.controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', '$location', 'Resources', 'HH', function ($scope, $modal, $log, $location, Resources, HH) {
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

    $scope.applicationForms = HH.listApplicationSystems();

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

    $scope.open = function (applicationSystemForm) {
        console.log('Open application system form ' + applicationSystemForm);
        var modalInstance = $modal.open({
            templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
            controller: 'ModalApplicationOptionCtrl',
            resolve: {
                applicationSystemForm: function () {
                    return  applicationSystemForm;
                }
            }
        });
        modalInstance.result.then(function (applicationOptionId) {
            $location.path("additionalQuestion/" + applicationSystemForm._id + '/' + applicationOptionId);
        }, function () {

        });
    };

    $scope.toggleCheck = function (applicationForm) {
        $scope.applicationForm = applicationForm;
    };
}]);

controllers.controller('QuestionsCtrl', ['$scope', '$modal', '$log', '$location', function ($scope, $modal, $log, $location) {
    console.log('QuestionsCtrl');
    
    $scope.addNewAdditionalQuestion = function (applicationSystemForm) {
        console.log('lisää uusi kyssäri ' + applicationSystemForm);
        var modalInstance = $modal.open({
            templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
            controller: 'ModalApplicationOptionCtrl',
            resolve: {
                applicationSystemForm: function () {
                    console.log('resolve ' + applicationSystemForm);
                    return applicationSystemForm;
                }
            }
        }).result.then(function (applicationOptionId) {
                $location.path("additionalQuestion/" + applicationSystemForm._id + '/' + applicationOptionId);
            }, function () {

            });
    };
}]);

controllers.controller('ModalApplicationOptionCtrl', ['$scope', '$location', 'Resources', '$modalInstance', 'applicationSystemForm', 'HH', function ($scope, $location, Resources, $modalInstance, applicationSystemForm, HH) {
    $scope.applicationOptions = [];
    $scope.queryParameters = {};
    $scope.ok = function () {
        console.log('Valittu hakukohde ' + this.applicationOption.oid);
        $modalInstance.close(this.applicationOption.oid);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.search = function () {
        console.log('Hae ' + applicationSystemForm);
        $scope.applicationOptions = HH.searchApplicationOptions(applicationSystemForm._id, $scope.queryParameters.term);
    };
}]);

controllers.controller('BackCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.back = function () {
        var path = $location.path().split("/");
        path.pop();
        $location.path(path.join('/'));
    };
    $scope.goto = function (element) {
        $location.path($location.path() + '/' + element._id);
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

var QuestionTypeCtrl = function ($scope, $modalInstance, Resources, $routeParams, applicationSystem) {

    var formWalker = _.walk(function (e) {
        return e.children;
    });

    $scope.themes = formWalker.filter(applicationSystem.form, _.walk.preorder, function (el) {
        return el._class && el._class.indexOf("Theme") != -1;
    });

    $scope.types = Resources.types.query($scope.queryParameters);

    $scope.ok = function () {
        $modalInstance.close({elementId: this.element, type: this.type});
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

controllers.controller('ModalQuestionCtrl', ['$scope', '$modalInstance', 'Resources', 'question', 'applicationSystem',
    function ($scope, $modalInstance, Resources, question, applicationSystem) {
        $scope.lang = "fi";

        $scope.languages = Resources.languages.query($scope.queryParameters);
        $scope.applicationSystem = applicationSystem;
        $scope.question = question;

        $scope.ok = function () {
            $modalInstance.close(this.question);
        };

        $scope.back = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.addNewTranslation = function () {
            alert('Not implemented!' + $scope.languages.length);
        };
    }]);

controllers.controller('AdditionalQuestionsCtrl',
    ['$scope', '$modal', '$log', '$location', 'Resources', '$routeParams', 'HH',
        function ($scope, $modal, $log, $location, Resources, $routeParams, HH) {
            console.log('perse');
            $scope.organization = HH.getOrganization();
            $scope.applicationSystem = HH.getApplicationSystem($routeParams.id);

            var formWalker = _.walk(function (e) {
                return e.children;
            });

            $scope.elements = formWalker.filter($scope.applicationSystem.form, _.walk.preorder, function (el) {
                return el._class && el._class.indexOf("Theme") != -1;
            });

            $scope.addQuestion = function (applicationSystem) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                    controller: QuestionTypeCtrl,
                    resolve: {
                        applicationSystem: function () {
                            return $scope.applicationSystem;
                        }
                    }
                }).result.then(function (data) {
                        $modal.open({
                            templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                            controller: 'ModalQuestionCtrl',
                            resolve: {
                                question: function () {
                                    return {
                                        i18nText: {
                                            translations: {}
                                        },
                                        help: {},
                                        additionalHelp: {},
                                        attributes: {},
                                        validators: {},
                                        type: data.type
                                    };
                                },
                                applicationSystem: function () {
                                    return $scope.applicationSystem;
                                }
                            }
                        }).result.then(function (question) {
                                console.log("Tallennetaan kysymys " + JSON.stringify(question));
                                if (!$scope.applicationSystem.additionalQuestions) {
                                    $scope.applicationSystem.additionalQuestions = [];
                                }
                                $scope.applicationSystem.additionalQuestions.push(question);
                            });
                    });
            };
            $scope.back = function () {
                $location.path("/");
            };
            $scope.edit = function (additionalQuestion) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                    controller: 'ModalQuestionCtrl',
                    resolve: {
                        element: function () {
                            var formWalker = _.walk(function (e) {
                                return e.children;
                            });
                            return formWalker.find($scope.applicationSystem.form, function (el) {
                                return el._id === additionalQuestion.parentId;
                            });
                        },
                        applicationSystem: function () {
                            return $scope.applicationSystem;
                        },
                        question: function () {
                            return additionalQuestion
                        }
                    },
                    scope: $scope
                });
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

controllers.controller('ElementCtrl', ['$scope', '$routeParams', '_', 'HH', function ($scope, $routeParams, _, HH) {
    $scope.applicationSystem.$promise.then(function (result) {
        $scope.element = HH.find($scope.applicationSystem, function (el) {
            return el._id === $routeParams.eid;
        });
        _.defaults($scope.element, {additionalHelp: {translations: {}}, verboseHelp: {translations: {}}, i18nText: {translations: {}}});
       var packageArray = $scope.element._class.split('.');
       packageArray.pop();
       $scope.templateGroup = packageArray.pop();
       if ($scope.templateGroup === 'elements') {
           $scope.templateGroup = 'questions';
       }
       $scope.expr = $scope.element.expr;
    });

}]);

controllers.controller('QuestionCtrl', ['$scope', '_', function ($scope, _) {
}]);

controllers.controller('ExprCtrl', ['$scope', function ($scope) {
    $scope.expr = $scope.element.expr;
}]);
