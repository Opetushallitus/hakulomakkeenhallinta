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

            $scope.applicationSystem;
            HH.fetchApplicationSystemForm($routeParams.id).then(
                function(data){
                    $scope.applicationSystem = data;
            });

            $scope.themes = [];
            FormEditor.query({'_path':'application-system-form', '_id':$routeParams.id ,'_oper':'additional-question-themes'}).$promise.then(
                function(data){
                    $scope.themes = data;
                    ThemeQuestions.getThemeQuestionListByOrgId({'_id':$routeParams.id, orgId: $routeParams.oid}).$promise.then(
                        function(data){
                            var que = [];
                            que = data;
                            for( var theme in $scope.themes){
                                $scope.themes[theme].additionalQuestions = [];
                                for(var question in que){
                                    if(que[question].theme != undefined){
                                        if($scope.themes[theme].id === que[question].theme){
                                            $scope.themes[theme].additionalQuestions.push(que[question]);
                                        }
                                    }
                                }
                            }

//                            console.log('111', que);
/*
                            for(var h in que){
                                if(que[h]._id != undefined){
                                    console.log('qq: ', que[h]);
                                    var tmpQ = {};
                                    tmpQ = que[h];
                                    console.log('EE: ', tmpQ);
                                    HH.fetchHakukohdeInfo(que[h].learningOpportunityId).then(
                                        function(data){
                                            console.log(data);
                                            tmpQ.haunInfo = data;
                                            console.log('JJ:', tmpQ);
                                            que[h] = tmpQ;
                                            console.log('####', que[h]);

                                        });
                                }
                            }
*/

                        });
                });

            $scope.getHakukohdeInfo = function(lopId){
                return HH.fetchHakukohdeInfo(lopId);
            };

            $scope.addQuestion = function(theme) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeCtrl'
                }).result.then(function(){
                        $modal.open({
                            templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                            controller: 'SelectThemeAndQuestionTypeCtrl'
                        }).result.then(function(data) {
                                console.log('SelectThemeAndQuestion ### data ', data);
                                QuestionData.newAdditionalQuestion();
                                QuestionData.setQuestionType(data.type);
                                QuestionData.setElement(theme);
                                QuestionData.setApplicatioSystemId($routeParams.id);
                                QuestionData.setEditFlag(false);
                                QuestionData.setLearningOpportunityId(QuestionData.getApplicationOption().oid);
                                $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid+'/'+QuestionData.getApplicationOption().oid+'/'+ theme.id);
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
                        $location.path('/modifyThemeQuestion/'+$routeParams.id+'/'+$routeParams.oid+'/'+ question._id);
                    });
            };

            $scope.back = function() {
                $location.path('/');
            };


            $scope.accordianState = function(theme){

                if(theme.additionalQuestions !== undefined && theme.additionalQuestions.length > 0){
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