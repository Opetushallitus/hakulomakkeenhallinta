'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$scope', '$modal', '$location', '_', '$routeParams', 'HH', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions',
        function($scope, $modal, $location, _, $routeParams, HH, FormEditor, FormWalker, QuestionData, ThemeQuestions ) {
            console.log('**** ThemeQuestionsByOrganisation *** ');
            $scope.lang = "fi";
            $scope.organisation;
            HH.fetchOrganisation($routeParams.oid).then(
                function(data){
                    $scope.organisation = data;
            });
//            $scope.applicationSystem = HH.getApplicationSystemForm();
            $scope.applicationSystem;
            HH.fetchApplicationSystemForm($routeParams.id).then(
                function(data){
                    $scope.applicationSystem = data;
            });

            $scope.themes = [];

            console.log('*** haetaan teemat ***** ', $routeParams.id);
            FormEditor.query({'_path':'application-system-form', '_id':$routeParams.id ,'_oper':'additional-question-themes'}).$promise.then(
                function(data){
                    $scope.themes = data;
                }
            );

            console.log('*** haetaan organisaation hakemukset ***** ', $routeParams.oid);
            ThemeQuestions.getThemeQuestionListByOrgId({'_id':$routeParams.id, orgId: $routeParams.oid}).$promise.then(
                function(data){
                    console.log('Ei vielä palauta mitään kun ei ole dataa: ', data);
                }
            );

            $scope.addQuestion = function(theme) {
                console.log('***** ', theme);

                $modal.open({
                    templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeCtrl'
                }).result.then(function(){
                        $modal.open({
                            templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                            controller: 'SelectThemeAndQuestionTypeCtrl'
                        }).result.then(function(data) {
                                QuestionData.newAdditionalQuestion();
                                QuestionData.setQuestionType(data.type);
                                QuestionData.setElement(element);
                                QuestionData.setApplicatioSystemId($routeParams.id);
                                QuestionData.setLearningOpportunityId($routeParams.oid);
                                QuestionData.setEditFlag(false);
                                $location.path('/additionalQuestion/'+$routeParams.id+'/'+$routeParams.oid+'/'+ theme.id);
                            });
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
        }]);