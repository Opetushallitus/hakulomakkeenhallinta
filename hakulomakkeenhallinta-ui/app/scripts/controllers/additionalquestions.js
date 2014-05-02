'use strict';

angular.module('hakulomakkeenhallintaUiApp')
    .controller('AdditionalQuestionsCtrl', ['$scope', '$modal', '$log', '$location', '_', 'Resources', '$routeParams', 'HH', 'ASFResource', 'FormWalker',
        function($scope, $modal, $log, $location, _, Resources, $routeParams, HH, ASFResource, FormWalker) {
            $scope.organization = HH.getOrganization();
            $scope.applicationSystem = ASFResource.get({
                '_id': $routeParams.id
            });

            $scope.applicationSystem.$promise.then(function(data) {
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
