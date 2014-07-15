'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$rootScope','$scope', '$modal', '$location', '_', '$routeParams', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions', 'Organisaatio', '$filter', 'TarjontaAPI',
        function($rootScope, $scope, $modal, $location, _, $routeParams, FormEditor, FormWalker, QuestionData, ThemeQuestions, Organisaatio, $filter, TarjontaAPI ) {
            $rootScope.LOGS('ThemeQuestionByOrganisationCtrl');

            $scope.haunNimi = '';
            $scope.organisation = '';
            $scope.organisationNimi = '';
            /**
             * haetaan valitun organisaation tiedot organisaatio palvelusta
             * valitun organisaation id:llä
             */
            Organisaatio.fetchOrganisation($routeParams.oid).then(
                function(data){
                    $scope.organisation = data;
                    $scope.organisationNimi = $filter('organisaatioNimi')($scope.organisation, $scope.userLang);
            });

            $scope.applicationSystem = {};
            /**
             * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
             */
            FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                function(data){
                    $scope.applicationSystem = data;
                    $scope.haunNimi = $filter('i18n')($scope.applicationSystem, 'name', $scope.userLang);
            });

            $scope.themes = [];
            /**
             * heataan hakulomakkeen teemat halomamekkeen id:llä ja siihen liityvä lisäkysymykset
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


            /**
             * avataan dialogit uuden kysymyksen hakukohteen ja tyypin alustamiseksi
             * @param theme
             */
            $scope.addQuestion = function(theme) {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/hakukohteen-valinta.html',
                    controller: 'SelectHakukohdeCtrl',
                    scope: $scope,
                    resolve: {
                        applicationSystem: function(){
                            return $scope.applicationSystem;
                        },
                        theme: function(){
                            return theme;
                        }
                    }
                }).result.then(function(data){
                        $modal.open({
                            templateUrl: 'partials/lisakysymykset/kysymystyypin-valinta.html',
                            controller: 'SelectQuestionTypeCtrl',
                            scope: $scope,
                            resolve: {
                                applicationSystem: function(){
                                    return data.applicationSystem;
                                },
                                theme: function(){
                                    return data.theme;
                                },
                                hakukohde: function(){
                                    return data.hakukohde;
                                }
                            }
                        }).result.then(function(data) {
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl','addQuestion()', data);
                                QuestionData.newAdditionalQuestion();
                                QuestionData.setQuestionType(data.type);
                                QuestionData.setTheme(theme);
                                QuestionData.setApplicatioSystemId($routeParams.id);
                                QuestionData.setEditFlag(false);
                                QuestionData.setLearningOpportunityId(QuestionData.getApplicationOption().oid);
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl', QuestionData.getQuestion() );
                                $location.path('/themeQuestionsByOrganisation/'+$routeParams.id+'/'+$routeParams.oid+'/'+QuestionData.getApplicationOption().oid+'/'+ theme.id+'/'+data.type.id);
                            });
                    });
            };
            /**
             * valitun kysymyksen muokkaus näkymään
             * @param question valittu kysymys
             */
            $scope.muokkaaKysymysta = function(question){
                QuestionData.setEditFlag(true);
                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl ', 'muokkaaKysmysta()', question._id);
                ThemeQuestions.getThemeQuestionById(question._id).then(
                    function(data){
                        $rootScope.LOGS('ThemeQuestionByOrganisationCtrl','muokkaaKysymysta() data:', data);
                        QuestionData.setQuestion(data);
                        $location.path('/modifyThemeQuestion/'+$routeParams.id+'/'+$routeParams.oid+'/'+ question._id);
                    });
            };
            /**
             * takaisin edelliselle sivulle
             */
            $scope.back = function() {
                $location.path('/');
            };


            $scope.accordianState = function(theme){
                if(theme.additionalQuestions !== undefined && theme.additionalQuestions.length > 0){
                    return true;
                }
                return false;
            };

            $scope.hakukohdeInfo = function(oid){
                if(oid !== undefined){
                    TarjontaAPI.fetchHakukohdeInfo(oid).then(
                         function(data){
                             return data;
                         }
                     );
                    return oid;
                }
            };

            $scope.sortQuestions = function() {
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/sort-questions.html',
                    controller: 'SortQuestionsCtrl'
                });
            };
        }]);