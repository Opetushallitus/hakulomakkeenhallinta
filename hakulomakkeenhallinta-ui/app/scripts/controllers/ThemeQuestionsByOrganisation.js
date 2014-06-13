'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$rootScope','$scope', '$modal', '$location', '_', '$routeParams', 'HH', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions',
        function($rootScope, $scope, $modal, $location, _, $routeParams, HH, FormEditor, FormWalker, QuestionData, ThemeQuestions ) {
            $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ', 6 );
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
                        });
                });

            $scope.getHakukohdeInfo = function(lopId){
                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',42,' getHakukohdeInfo ');
                HH.fetchHakukohdeInfo(lopId).then(
                    function(data){
                        return data;
                    });
            };

            $scope.addQuestion = function(theme) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeCtrl',
                    scope: $scope
                }).result.then(function(){
                        $modal.open({
                            templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                            controller: 'SelectThemeAndQuestionTypeCtrl'
                        }).result.then(function(data) {
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',58, data);
                                QuestionData.newAdditionalQuestion();
                                QuestionData.setQuestionType(data.type);
                                QuestionData.setElement(theme);
                                QuestionData.setApplicatioSystemId($routeParams.id);
                                QuestionData.setEditFlag(false);
                                QuestionData.setLearningOpportunityId(QuestionData.getApplicationOption().oid);
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',65, QuestionData.getQuestion() );
                                $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid+'/'+QuestionData.getApplicationOption().oid+'/'+ theme.id+'/'+data.type.id);
                            });
                    });
            };

            $scope.muokkaaKysymysta = function(question){
                QuestionData.setEditFlag(true);
                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',72 ,' muokkaaKysmysta', question._id);
                ThemeQuestions.get({'_id': question._id}).$promise.then(
                    function(data){
                        $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',75,' muokkaa:', data);
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