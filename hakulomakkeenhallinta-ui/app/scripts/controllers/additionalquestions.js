'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AdditionalQuestionsCtrl', ['$scope', '$modal', '$location', '_', '$routeParams', 'HH', 'ASForms', 'FormWalker', 'Languages', 'QuestionData',
        function($scope, $modal, $location, _, $routeParams, HH, ASForms, FormWalker, Languages, QuestionData) {
            $scope.lang = "fi";
            $scope.organization = HH.getOrganization();
            $scope.applicationSystem = ASForms.get({ '_id': $routeParams.id });
            $scope.elements = [];

            ASForms.get({'_id': $routeParams.id, '_addQuestions':'additionalQuestions' }).$promise.then(
                function(data){
                    if( data.additionalQuestions !== undefined){
                        var questionDataLS = [];
                        questionDataLS = JSON.parse(data.additionalQuestions);
                        console.log(questionDataLS.length);
                        QuestionData.clearAdditonalQuestions();
                        for (var d in questionDataLS){
                            QuestionData.setQuestion(questionDataLS[d]);
                        }
                    }
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
                                    if(!$scope.elements[e].additionalQuestions){
                                        $scope.elements[e].additionalQuestions = [];
                                    }
                                    if(questions[q].theme === $scope.elements[e]._id ){
                                        console.log(questions[q]);
                                        $scope.elements[e].additionalQuestions.push(questions[q]);
                                    }
                                }
                            }
                        }
                    });

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

            $scope.goTo = function(question){
                console.log(question);
                $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid+'/'+ question.theme);
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
