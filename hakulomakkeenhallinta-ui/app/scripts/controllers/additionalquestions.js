'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AdditionalQuestionsCtrl', ['$scope', '$modal', '$location', '_', '$routeParams', 'HH', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions',
        function($scope, $modal, $location, _, $routeParams, HH, FormEditor, FormWalker, QuestionData, ThemeQuestions) {
            console.log('**** AdditionalQuestionsCtrl *** ');
            $scope.lang = "fi";
            $scope.organisation = HH.getOrganization();
            console.log('*** haetaan formi teemoja varten');
//            $scope.applicationSystem = FormEditor.get({ '_path': 'application-system-form', '_id': $routeParams.id });
            //TODO: poista tämä
            $scope.applicationSystem = FormEditor.get({'_path':'application-system-form', '_id': 'haku1' });
            $scope.elements = [];
            $scope.applicationOption = QuestionData.getApplicationOption();

            $scope.applicationSystem.$promise.then(function(data) {
                console.dir(data);
                $scope.elements =data.children;
                for(var ea in $scope.elements){
                    if($scope.elements[ea].id === "henkilotiedot"){
                        $scope.elements.splice(ea, 1);
                    }
                    if( $scope.elements[ea].id === "koulutustausta" ){
                        $scope.elements.splice(ea, 1);
                    }
                }
                console.log('### haetaan lisäkysmykset ###');
                ThemeQuestions.query({ '_id': 'list', '_aoid': $routeParams.id }).$promise.then(
                    function(data){
                        console.log(data);
                        QuestionData.clearAdditonalQuestions();
                        for (var d in data){
                            console.log(data[d]._id);
                            if(data[d]._id != undefined){
                                QuestionData.setQuestion(data[d]);
                            }
                        }

                        if(QuestionData.getAdditionalQuestions().length >0){
                            var questions = QuestionData.getAdditionalQuestions();
                            for (var e in $scope.elements){
                                $scope.elements[e].additionalQuestions = [];
                                for (var q  in questions){
                                    if(questions[q].theme === $scope.elements[e].id ){
                                        $scope.elements[e].additionalQuestions.push(questions[q]);
                                    }
                                }
                            }
                        }

                    });
            });

            $scope.addQuestion = function(element) {
                console.log('***** ', element);
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                    controller: 'SelectThemeAndQuestionTypeCtrl'
                }).result.then(function(data) {
                        QuestionData.newAdditionalQuestion();
                        QuestionData.setQuestionType(data.type);
                        QuestionData.setElement(element);
                        QuestionData.setApplicatioSystemId($routeParams.id);
                        QuestionData.setLearningOpportunityId($routeParams.aoid);
                        QuestionData.setEditFlag(false);
                        $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid+'/'+ element.id);
                    });
            };

            $scope.muokkaaKysymysta = function(question){
                QuestionData.setEditFlag(true);
                console.log('muokkaa:', question._id);
                ThemeQuestions.get({'_id': question._id}).$promise.then(
                    function(data){
                        console.log('muokkaa:', data);
                        QuestionData.setQuestion(data);
                        $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.aoid+'/'+ question._id);
                    });
            };

            $scope.back = function() {
                $location.path('/');
            };

            $scope.accordianState = function(element){

                if(element.additionalQuestions !== undefined && element.additionalQuestions.length > 0){
                    return true;
                }
                return false;
            }

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
