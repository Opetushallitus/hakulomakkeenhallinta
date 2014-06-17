'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$rootScope','$scope', '$modal', '$location', '_', '$routeParams', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions', 'Organisaatio',
        function($rootScope, $scope, $modal, $location, _, $routeParams, FormEditor, FormWalker, QuestionData, ThemeQuestions, Organisaatio ) {
            $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ', 1 );

            $scope.organisation;
            /**
             * haetaan valitun organisaation tiedot organisaatio palvelusta
             * valitun organisaation id:llä
             */
            Organisaatio.fetchOrganisation($routeParams.oid).then(
                function(data){
                    $scope.organisation = data;
            });

            $scope.applicationSystem;
            /**
             * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
             */
            FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                function(data){
                    $scope.applicationSystem = data;
            });

            $scope.themes = [];
            /**
             * heataan hakulomakkeen teemat ja siihen liityvä lisäkysymykset
             * ja asetetaan ne käyttöliittymään oikean teeman alle
             */
            FormEditor.getApplicationSystemFormThemes($routeParams.id).then(
                function(data){
                    $scope.themes = data;
                    ThemeQuestions.getThemeQuestionListByOrgId($routeParams.id, $routeParams.oid).then(
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
                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',2,' getHakukohdeInfo ');
                TarjontaAPI.fetchHakukohdeInfo(lopId).then(
                    function(data){
                        return data;
                    });
            };

            $scope.addQuestion = function(theme) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystem: function(){
                            return $scope.applicationSystem;
                        }
                    }
                }).result.then(function(){
                        $modal.open({
                            templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                            controller: 'SelectThemeAndQuestionTypeCtrl'
                        }).result.then(function(data) {
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',3, data);
                                QuestionData.newAdditionalQuestion();
                                QuestionData.setQuestionType(data.type);
                                QuestionData.setElement(theme);
                                QuestionData.setApplicatioSystemId($routeParams.id);
                                QuestionData.setEditFlag(false);
                                QuestionData.setLearningOpportunityId(QuestionData.getApplicationOption().oid);
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',4, QuestionData.getQuestion() );
                                $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid+'/'+QuestionData.getApplicationOption().oid+'/'+ theme.id+'/'+data.type.id);
                            });
                    });
            };

            $scope.muokkaaKysymysta = function(question){
                QuestionData.setEditFlag(true);
                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',5 ,' muokkaaKysmysta', question._id);
                ThemeQuestions.get({'_id': question._id}).$promise.then(
                    function(data){
                        $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ',6,' muokkaa:', data);
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

            $scope.sortQuestions = function() {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/sort-questions.html',
                    controller: 'SortQuestionsCtrl'
                });
            };
        }]);