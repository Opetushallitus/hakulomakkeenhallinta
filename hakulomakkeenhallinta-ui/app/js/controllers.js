"use strict";

/* Controllers */

var controllers = angular.module('hakulomakkeenhallinta.controllers', []);

controllers.controller('AppCtrl', ['$scope', 'Resources',
    function($scope, Resources) {
        $scope.accordionStates = {};
        $scope.languages = Resources.languages.query();
    }
]);

controllers.controller('KoodistoCtrl', ['$scope', 'Koodisto',
    function($scope, Koodisto) {
        Koodisto.getKoodistot().then(function(koodistot) {
            $scope.koodistot = koodistot;
        });

        $scope.getKoodisto = function() {
            Koodisto.getKoodisto($scope.selectedKoodisto.id).then(function(koodisto) {
                $scope.koodisto = koodisto;
            });
        };
    }
]);

controllers.controller('ApplicationSystemFormCtrl', ['$scope', 'ASFResource', '$routeParams', function($scope, ASFResource, $routeParams) {
        $scope.applicationSystem = ASFResource.get( {'_id' : $routeParams.id });

        $scope.delete = function(array, index) {
            array.splice(index, 0);
        };

        $scope.selectTemplate = function(type) {
            var t = type.split('.').pop();
            if (t === 'Theme' ||  t === 'RelatedQuestionComplexRule') {
                return t;
            }
            return "element";
        };

        $scope.expr2str = function(expr) {
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
    }
]);

controllers.controller('HakulomakkeetCtrl', ['$scope', '$modal', '$log', '$location', 'Resources', 'HH', 'ASFResource',
    function($scope, $modal, $log, $location, Resources, HH, ASFResource) {

        $scope.question = {};
        $scope.selectedApplicationSystems = [];
        $scope.languages = [{
            title: "Suomi"
        }, {
            title: "Ruotsi"
        }, {
            title: "Englanti",
            active: true
        }];
        $scope.items = [{
            id: '1',
            name: 'Aasian tutkimus'
        }, {
            id: '2',
            name: 'Aasian tutkimus, kandidaatinopinnot'
        }];

        $scope.applicationForms = ASFResource.query(); 

        $scope.luoHakulomake = function() {
            $modal.open({
                templateUrl: 'partials/lomake/liita-haku-lomakkeeseen.html',
                controller: 'liitaHakuLomakkeeseenCtrl'
            }).result.then(function(result) {
                console.log("asf save");
                ASFResource.save(result);
                $scope.applicationForms = ASFResource.query(); 
            });
        };

        $scope.open = function(applicationSystemForm) {
            console.log('Open application system form ' + applicationSystemForm);
            var modalInstance = $modal.open({
                templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                controller: 'ModalApplicationOptionCtrl',
                resolve: {
                    applicationSystemForm: function() {
                        return applicationSystemForm;
                    }
                }
            });
            modalInstance.result.then(function(applicationOptionId) {
                $location.path("additionalQuestion/" + applicationSystemForm._id + '/' + applicationOptionId);
            }, function() {

            });
        };

        $scope.toggleCheck = function(applicationForm) {
            $scope.applicationForm = applicationForm;
        };
    }
]);

controllers.controller('QuestionsCtrl', ['$scope', '$modal', '$log', '$location',
    function($scope, $modal, $log, $location) {
        console.log('QuestionsCtrl');

        $scope.addNewAdditionalQuestion = function(applicationSystemForm) {
            console.log('lisää uusi kyssäri ' + applicationSystemForm);
            var modalInstance = $modal.open({
                templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                controller: 'ModalApplicationOptionCtrl',
                resolve: {
                    applicationSystemForm: function() {
                        console.log('resolve ' + applicationSystemForm);
                        return applicationSystemForm;
                    }
                }
            }).result.then(function(applicationOptionId) {
                $location.path("additionalQuestion/" + applicationSystemForm._id + '/' + applicationOptionId);
            }, function() {

            });
        };
    }
]);

controllers.controller('ModalApplicationOptionCtrl', ['$scope', '$location', 'Resources', '$modalInstance', 'applicationSystemForm', 'HH',
    function($scope, $location, Resources, $modalInstance, applicationSystemForm, HH) {
        $scope.applicationOptions = [];
        $scope.queryParameters = {};
        $scope.ok = function() {
            console.log('Valittu hakukohde ' + this.applicationOption.oid);
            $modalInstance.close(this.applicationOption.oid);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.search = function() {
            console.log('Hae ' + applicationSystemForm);
            $scope.applicationOptions = HH.searchApplicationOptions(applicationSystemForm._id, $scope.queryParameters.term);
        };
    }
]);

controllers.controller('BackCtrl', ['$scope', '$location',
    function($scope, $location) {
        $scope.back = function() {
            var path = $location.path().split("/");
            path.pop();
            $location.path(path.join('/'));
        };
        $scope.goto = function(element) {
            $location.path($location.path() + '/' + element._id);
        };
    }
]);

controllers.controller('MallipohjatCtrl', ['$scope', '_', 'FormResource', '$i18next', function($scope, _, FormResource, $i18next) {
        $scope.forms = FormResource.query();
        $scope.delete = function(form, index) {
            FormResource.delete(_.pick(form, '_id'));
            $scope.forms.splice(index, 1);
            //_.remove($scope.forms, form);
        };
        $scope.copy = function(form, index) {
            var newForm = FormResource.get(_.pick(form, '_id'));
            FormResource.save(_.pick(newForm, '_id'));
        };

    }
]);

var liitaHakuLomakkeeseenCtrl = function($scope, $modalInstance, ASFResource, FormResource, ApplicationSystemResource) {
    $scope.applicationSystems = ApplicationSystemResource.query(); 
    $scope.applicationFormTemplates = FormResource.query();
    $scope.ok = function() {
        var applicationSystemForm = {
            applicationFormTemplate: this.applicationFormTemplate,
            applicationSystem: this.applicationSystem
        };
        console.log(applicationSystemForm);
        $modalInstance.close(applicationSystemForm);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

var SelectThemeAndQuestionType = function($scope, $modalInstance, TypeResource, $routeParams, FormWalker, applicationSystem) {

    $scope.themes = FormWalker.filterByType(applicationSystem.form, "Theme");
    $scope.types = TypeResource.query($scope.queryParameters);

    $scope.ok = function() {
        $modalInstance.close({
            theme: this.element,
            type: this.type
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};

controllers.controller('ModalQuestionCtrl', ['$scope', '$modalInstance', 'Resources', 'question', 'applicationSystem', 'parentElement',
    function($scope, $modalInstance, Resources, question, applicationSystem, parentElement) {
        $scope.lang = "fi";
        $scope.element = parentElement;
        $scope.languages = Resources.languages.query($scope.queryParameters);
        $scope.applicationSystem = applicationSystem;
        $scope.question = question;

        $scope.ok = function() {
            $modalInstance.close({
                    question : this.question,
                    parentElement: parentElement
                });
        };

        $scope.back = function() {
            $modalInstance.dismiss('cancel');
        };
        $scope.addNewTranslation = function() {
            alert('Not implemented!' + $scope.languages.length);
        };
    }
]);

controllers.controller('AdditionalQuestionsCtrl', ['$scope', '$modal', '$log', '$location', '_', 'Resources', '$routeParams', 'HH', 'ASF', 'FormWalker',
    function($scope, $modal, $log, $location, _, Resources, $routeParams, HH, ASF, FormWalker) {
        $scope.organization = HH.getOrganization();
        var p = ASF.getASF($routeParams.id);
        p.then(function(result) {
            $scope.applicationSystem = result;
            $scope.elements = FormWalker.filterByType($scope.applicationSystem.form, "Theme");
        });

        $scope.addQuestion = function(applicationSystem) {
            $modal.open({
                templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                controller: 'SelectThemeAndQuestionType',
                resolve: {
                    applicationSystem: function() {
                        return $scope.applicationSystem;
                    }
                }
            }).result.then(function(data) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                    controller: 'ModalQuestionCtrl',
                    resolve: {
                        question: function() {
                            return _.defaults({}, {additionalHelp: {translations: {}}, verboseHelp: {translations: {}}, i18nText: {translations: {}}});
                        },
                        parentElement: function() {
                            return data.theme;
                        },
                        applicationSystem: function() {
                            return $scope.applicationSystem;
                        }
                    }
                }).result.then(function(data) {
                    if (!data.parentElement.additionalQuestions) {
                        data.parentElement.additionalQuestions = [];
                    }
                    data.parentElement.additionalQuestions.push(data.question);
                });
            });
        };
        $scope.back = function() {
            $location.path("/");
        };

        $scope.edit = function(additionalQuestion) {
            $modal.open({
                templateUrl: 'partials/lisakysymykset/kysymystekstit.html',
                controller: 'ModalQuestionCtrl',
                resolve: {
                    element: function() {
                        return HH.find($scope.applicationSystem, function(el) {
                            return el._id === additionalQuestion.parentId;
                        });
                    },
                    applicationSystem: function() {
                        return $scope.applicationSystem;
                    },
                    question: function() {
                        return additionalQuestion;
                    }
                },
                scope: $scope
            });
        };

        $scope.sortQuestions = function() {
            $modal.open({
                templateUrl: 'partials/lisakysymykset/sort-questions.html',
                controller: SortQuestionsCtrl
            });
        };
    }
]);

var SortQuestionsCtrl = function($scope, $modalInstance, Resources) {
    $scope.first = true;
    $scope.last = true;

    $scope.themes = Resources.themes.query($scope.queryParameters);
    $scope.additionalQuestions = Resources.additionalQuestions.query($scope.queryParameters);
    $scope.ok = function() {
        console.log($scope.additionalQuestions);
        $modalInstance.close(this.question);
    };

    $scope.cancel = function() {
        console.log("SortQuestionsCtrl cancel");
        $modalInstance.dismiss('cancel');
    };

    $scope.select = function() {
        $scope.updateButtons();
        $scope.additionalQuestion = this.additionalQuestion;
    };

    $scope.move = function() {
        var index = $scope.additionalQuestions.indexOf(this.additionalQuestion);
        var tmp = $scope.additionalQuestions[index];
        $scope.additionalQuestions[index] = $scope.additionalQuestions[index + 0];
        $scope.additionalQuestions[index + 0] = tmp;
        $scope.updateButtons();
    };

    $scope.up = function() {
        $scope.move('up');
    };

    $scope.down = function() {
        console.log("SortQuestionsCtrl down");
        $scope.move('down');
        $scope.updateButtons();
    };

    $scope.updateButtons = function() {
        $scope.first = $scope.additionalQuestions.indexOf(this.additionalQuestion) === -1;
        $scope.last = $scope.additionalQuestions.indexOf(this.additionalQuestion) == $scope.additionalQuestions.length - 0;
    };

};

controllers.controller('ElementCtrl', ['$scope', '$routeParams', '_', 'HH', function ($scope, $routeParams, _, HH) {
    $scope.applicationSystem.$promise.then(function (result) {
        $scope.element = HH.find($scope.applicationSystem, function (el) {
            console.log(el._id  +  " === " +$routeParams.eid + " = "  + (el._id === $routeParams.eid));
            return el._id === $routeParams.eid;
        });
        console.log("ElementCtrl " + $scope.element);
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

controllers.controller('QuestionCtrl', ['$scope', '$modal', '_',
    function($scope, $modal, _) {
        $scope.addValidator = function(validators) {
            $modal.open({
                templateUrl: 'partials/elements/edit/validators/new.html',
                controller: 'ValidatorModalCtrl'
            }).result.then(function(validator) {
                validators.push(validator);
            });
        };
    }
]);

controllers.controller('ValidatorModalCtrl', ['$scope',
    function($scope) {
        $scope.types = {
            'Pakollinen': 'RequiredFieldValidator'
        };
    }
]);
controllers.controller('ExprCtrl', ['$scope',
    function($scope) {
        $scope.expr = $scope.element.expr;
    }
]);
