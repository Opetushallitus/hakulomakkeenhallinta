'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AdditionalQuestionsCtrl', ['$scope', '$modal', '$location', '_', '$routeParams', 'HH', 'ASForms', 'FormWalker', 'Languages', 'QuestionData',
        function($scope, $modal, $location, _, $routeParams, HH, ASForms, FormWalker, Languages, QuestionData) {
            $scope.lang = "fi";
            $scope.organization = HH.getOrganization();
            $scope.applicationSystem = ASForms.get({ '_id': $routeParams.id });
            $scope.elements = [];

            $scope.applicationSystem.$promise.then(function(data) {
                $scope.elements = FormWalker.filterByType($scope.applicationSystem.form, "Theme");

                for(var ea in $scope.elements){
                    if($scope.elements[ea]._id === "HenkilotiedotGrp"){
                        $scope.elements.splice(ea, 1);
                    }
                    if( $scope.elements[ea]._id === "KoulutustaustaGrp" ){
                        $scope.elements.splice(ea, 1);
                    }
                }

                if(QuestionData.getAdditionalQuestions().length >0){
                    var questions = QuestionData.getAdditionalQuestions()
                    for (var q  in questions){
                        for (var e in $scope.elements){
                            console.log($scope.elements[e]._id);
                            if(!$scope.elements[e].additionalQuestions){
                                $scope.elements[e].additionalQuestions = [];
                            }
                            if(questions[q].parentElement_id === $scope.elements[e]._id ){
                                $scope.elements[e].additionalQuestions.push(questions[q]);
                            }
                        }
                    }
                }
            });

            $scope.addQuestion = function(element) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                    controller: 'SelectThemeAndQuestionTypeCtrl'
                }).result.then(function(data) {
                        QuestionData.newAdditionalQuestion();
                        QuestionData.setQuestionType(data.type);
                        QuestionData.setElement(element);
                        QuestionData.setApplicatioSystem($scope.applicationSystem);
                        $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid+'/'+ element._id);
                    });
            };
            console.dir(QuestionData.getAdditionalQuestions());

            $scope.goTo = function(element){
                $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid+'/'+ element.parentElement_id);
            }

            $scope.back = function() {
                $location.path('/');
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
