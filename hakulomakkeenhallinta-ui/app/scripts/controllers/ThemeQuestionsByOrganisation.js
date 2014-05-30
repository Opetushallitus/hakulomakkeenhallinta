'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$scope', '$modal', '$location', '_', '$routeParams', 'HH', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions',
        function($scope, $modal, $location, _, $routeParams, HH, FormEditor, FormWalker, QuestionData, ThemeQuestions ) {
            console.log('**** ThemeQuestionsByOrganisation *** ');
            $scope.lang = "fi";
            $scope.organization = HH.getOrganization();
            $scope.applicationSystem = HH.getApplicationSystemForm();

            console.log('*** haetaan organisaation hakemukset ***** ', $scope.organization.oid);
            ThemeQuestions.query({'_id':'list','_aoid':$scope.applicationSystem._id, orgId: $scope.organization.oid}).$promise.then(
                function(data){
                    console.log(data);
                }
            );

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

