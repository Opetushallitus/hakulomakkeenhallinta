'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AdditionalQuestionsCtrl', ['$scope', '$modal', '$location', '_', '$routeParams', 'HH', 'ASForms', 'FormWalker',
        function($scope, $modal, $location, _, $routeParams, HH, ASForms, FormWalker) {
            $scope.organization = HH.getOrganization();
            $scope.applicationSystem = ASForms.get({ '_id': $routeParams.id });

            $scope.applicationSystem.$promise.then(function(data) {
                $scope.elements = FormWalker.filterByType($scope.applicationSystem.form, "Theme");
            });

            $scope.addQuestion = function(applicationSystem) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                    controller: 'SelectThemeAndQuestionTypeCtrl',
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
                                return _.defaults({}, {
                                    additionalHelp: {
                                        translations: {}
                                    },
                                    verboseHelp: {
                                        translations: {}
                                    },
                                    i18nText: {
                                        translations: {}
                                    }
                                });
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
                    controller: 'SortQuestionsCtrl'
                });
            };
        }
    ]);
