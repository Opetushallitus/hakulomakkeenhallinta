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

                ASForms.get({ '_id': $routeParams.id, '_aoid': $routeParams.aoid, '_getAll':'getAll' }).$promise.then(
                    function(data){
                        if( data.additionalQuestions !== undefined){
                            var questionDataLS = [];
                            questionDataLS = JSON.parse(data.additionalQuestions);
                            QuestionData.clearAdditonalQuestions();
                            for (var d in questionDataLS){
                                QuestionData.setQuestion(questionDataLS[d]);
                            }
                        }

                        if(QuestionData.getAdditionalQuestions().length >0){
                            var questions = QuestionData.getAdditionalQuestions();
                            for (var q  in questions){
                                for (var e in $scope.elements){
                                    if(!$scope.elements[e].additionalQuestions){
                                        $scope.elements[e].additionalQuestions = [];
                                    }
                                    if(questions[q].theme === $scope.elements[e]._id ){
                                        $scope.elements[e].additionalQuestions.push(questions[q]);
                                    }
                                }
                            }
                        }
                    });
            })

            $scope.addQuestion = function(element) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                    controller: 'SelectThemeAndQuestionTypeCtrl'
                }).result.then(function(data) {
                        QuestionData.newAdditionalQuestion();
                        QuestionData.setQuestionType(data.type);
                        QuestionData.setElement(element);
                        QuestionData.setApplicatioSystem($scope.applicationSystem);
                        QuestionData.setPrefrence($routeParams.aoid);
                        QuestionData.setEditFlag(false);
                        $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid+'/'+ element._id);
                    });
            };

            $scope.muokkaaKysymysta = function(question){
                QuestionData.setEditFlag(true);
                ASForms.get({'_id': question.applicationSystemId, '_aoid': $routeParams.aoid, '_qid': question._id}).$promise.then(
                    function(data){
                        QuestionData.setQuestion(data);
                        $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid+'/'+ question._id);
                    });
            };

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
