'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('AdditionalQuestionsCtrl', ['$scope', '$modal', '$location', '_', '$routeParams', 'HH', 'ASForms', 'FormWalker', 'Languages', 'QuestionData',
        function($scope, $modal, $location, _, $routeParams, HH, ASForms, FormWalker, Languages, QuestionData) {
            console.log('**** AdditionalQuestionsCtrl *** ');
            $scope.lang = "fi";
            $scope.organization = HH.getOrganization();
//            $scope.applicationSystem = ASForms.get({ '_id': $routeParams.id });
            console.log('*** haetaan formi teemoja varten');
//            $scope.applicationSystem = ASForms.get({ '_id': 'application-system-form', '_aoid': $routeParams.id });
            //TODO: poista tämä
            $scope.applicationSystem = ASForms.get({ '_id': 'application-system-form', '_aoid': 'haku1' });
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
                /*$scope.elements = FormWalker.filterByType($scope.applicationSystem.form, "Theme");
                //TODO: tämän suodatus tulee tehdä jotenkin muuten kuin näin ?
                for(var ea in $scope.elements){
                    if($scope.elements[ea]._id === "HenkilotiedotGrp"){
                        $scope.elements.splice(ea, 1);
                    }
                    if( $scope.elements[ea]._id === "KoulutustaustaGrp" ){
                        $scope.elements.splice(ea, 1);
                    }
                }*/

                //ASForms.get({ '_id': $routeParams.id, '_aoid': $routeParams.aoid, '_getAll':'getAll' }).$promise.then(
                console.log('### haetaan lisäkysmykset ###');
//                ASForms.get({ '_id': $routeParams.id, '_aoid': $routeParams.aoid }).$promise.then(
//                ASForms.query({ '_id': 'haku1', '_aoid': $routeParams.aoid }).$promise.then(
                ASForms.query({ '_id': 'haku1' }).$promise.then(
                    function(data){
                        console.log(data);
                        //TODO: tämä if osio tulee poistaa kun oikea back endon saatavilla
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
                            for (var e in $scope.elements){
                                $scope.elements[e].additionalQuestions = [];
                                for (var q  in questions){
                                    if(questions[q].theme === $scope.elements[e]._id ){
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
//                        QuestionData.setApplicatioSystemId($routeParams.id);
                        QuestionData.setApplicatioSystemId('haku1');
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
