'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ThemeQuestionsByOrganisationCtrl', ['$rootScope','$scope', '$modal', '$location', '_', '$routeParams', 'FormEditor', 'FormWalker', 'QuestionData', 'ThemeQuestions', 'Organisaatio', '$filter', 'TarjontaAPI', '$q', 'AlertMsg',
        function($rootScope, $scope, $modal, $location, _, $routeParams, FormEditor, FormWalker, QuestionData, ThemeQuestions, Organisaatio, $filter, TarjontaAPI, $q, AlertMsg ) {
            $rootScope.LOGS('ThemeQuestionByOrganisationCtrl');

            $scope.haunNimi = '';
            $scope.organisationNimi = '';
            /**
             * haetaan valitun organisaation tiedot organisaatio palvelusta
             * valitun organisaation id:llä
             */
            Organisaatio.fetchOrganisation($routeParams.oid).then(
                function (data) {
                    $scope.organisationNimi = $filter('organisaatioNimi')(data, $scope.userLang);
                }
            );

            $scope.applicationSystem = {};
            /**
             * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
             */
            FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                function (data) {
                    $scope.applicationSystem = data;
                    $scope.haunNimi = $filter('i18n')(data, 'name', $scope.userLang);
                }
            );

            $scope.themes = [];
            /**
             * heataan hakulomakkeen teemat halomamekkeen id:llä ja siihen liityvä lisäkysymykset
             * ja asetetaan ne käyttöliittymään oikean teeman ja hakukohteen alle
             */
            /*function hakukohdeKohtaisetKysymykset() {
                var deferred = $q.defer();
                FormEditor.getApplicationSystemFormThemes($routeParams.id).then(
                    function (themes) {
                        ThemeQuestions.getThemeQuestionListByOrgId($routeParams.id, $routeParams.oid).then(
                            function (themeQues) {
                                var hakukohdeIds = [];
                                //parsitaan lisäkysymyksistä hakukohde id:t taulukkoon
                                hakukohdeIds = _.uniq( _.map(themeQues, function (lopIds) { return lopIds.learningOpportunityId; }));
                                //parsitaan lisäkysmys oikean teeman ja hakukohteen alle
                                for (var themeIndx = 0, themesLength = themes.length; themeIndx < themesLength; themeIndx += 1){
                                    themes[themeIndx].hkkohde = [];
                                    for (var hkIndx = 0, hakukohdeIdsLength = hakukohdeIds.length; hkIndx < hakukohdeIdsLength; hkIndx += 1){
                                        themes[themeIndx].hkkohde[hkIndx] = {};
                                        themes[themeIndx].hkkohde[hkIndx].aoid = hakukohdeIds[hkIndx];
                                        themes[themeIndx].hkkohde[hkIndx].additionalQuestions = [];
                                        for (var queIndx = 0, themeQsLength = themeQues.length; queIndx < themeQsLength; queIndx += 1){
                                            if (themeQues[queIndx].theme !== undefined ){
                                                if (themes[themeIndx].id === themeQues[queIndx].theme && hakukohdeIds[hkIndx] === themeQues[queIndx].learningOpportunityId){
                                                    themes[themeIndx].hkkohde[hkIndx].additionalQuestions.push(themeQues[queIndx]);
                                                }
                                            }
                                        }
                                    }
                                }
                                deferred.resolve(themes);
                            }
                        );
                    }
                );
                return deferred.promise;
            };
            *//**
             * päivitetään asynkroninen teema data $scopeen kun se on käsitelty
             * yllä olevassa funtiossa
             *//*
            hakukohdeKohtaisetKysymykset().then(function(data){
                $scope.themes = data;
            });*/

            function lista() {
                var def = $q.defer();
                getThemes().then(function (data) {
                    var themes = data;
//                    console.log('*** teemat');
                    getThemeQuestions().then(function (data) {
//                        console.log('*** kysmykset', data);
                        var que = [];
                        var lopIds = [];
                        que = data;
                        for (var oa = 0; oa < que.length; oa += 1) {
                            if (lopIds.indexOf(que[oa].learningOpportunityId) === -1) {
//                                console.log(que[oa].learningOpportunityId, '# ', oa);
                                lopIds.push(que[oa].learningOpportunityId);
                            }
                        }
                        for (var the in themes){
//                            console.log(themes[the]);
                            themes[the].hkkohde = [];
                            for(var lo in lopIds){
//                                console.log(themes[the].lop, the, lo);
                                themes[the].hkkohde[lo] = {};
                                themes[the].hkkohde[lo].aoid = lopIds[lo] ;
                                themes[the].hkkohde[lo].additionalQuestions = [];
                                for(var qe in que){
                                    if(que[qe].theme !== undefined){
                                        if(themes[the].id === que[qe].theme && lopIds[lo] === que[qe].learningOpportunityId){
//                                            console.log(que[qe]);
                                            themes[the].hkkohde[lo].additionalQuestions.push(que[qe]);
                                        }
                                    }
                                }
                            }
                        }
                        def.resolve(themes);
                    });
                });
                return def.promise;
            }

            function getQuestons(hakuOid, teema){
                var deferred = $q.defer();
                console.log(teema, hakuOid);
                $.getJSON('http://localhost:8080/app/test-data/'+teema+'.'+hakuOid+'.json',function(data){
                    deferred.resolve(data);
                });
                return deferred.promise;
            };

            function getThemes(){
                var deferred = $q.defer();
                $.getJSON('http://localhost:8080/app/test-data/additional-question-themes.json',function(data){
                    deferred.resolve(data);
                });
                return deferred.promise;
            };

            function getThemeQuestions(){
                var deferred = $q.defer();
                $.getJSON('http://localhost:8080/app/test-data/themequestions2.json',function(data){
                    deferred.resolve(data);
                });
                return deferred.promise;
            };

            lista().then(function(data){
                $scope.themes = data;
            });
            /**
             * avataan dialogit uuden kysymyksen hakukohteen ja tyypin alustamiseksi
             * @param theme
             */
            $scope.addQuestion = function(theme) {
                $modal.open({
                    templateUrl: 'partials/dialogs/hakukohteen-valinta.html',
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
                            templateUrl: 'partials/dialogs/kysymystyypin-valinta.html',
                            controller: 'SelectQuestionTypeCtrl',
                            scope: $scope,
                            resolve: {
                                applicationSystem: function () {
                                    return data.applicationSystem;
                                },
                                theme: function () {
                                    return data.theme;
                                },
                                hakukohde: function () {
                                    return data.hakukohde;
                                }
                            }
                        }).result.then(function (data) {
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl','addQuestion()', data);
                                QuestionData.newAdditionalQuestion();
                                QuestionData.setQuestionType(data.type);
                                QuestionData.setTheme(theme);
                                QuestionData.setApplicatioSystemId($routeParams.id);
                                QuestionData.setEditFlag(false);
                                QuestionData.setLearningOpportunityId(QuestionData.getApplicationOption().oid);
                                $rootScope.LOGS('ThemeQuestionByOrganisationCtrl', QuestionData.getQuestion() );
                                $location.path('/themeQuestionsByOrganisation/' + $routeParams.id + '/' + $routeParams.oid + '/' + QuestionData.getApplicationOption().oid + '/' + theme.id + '/' + data.type.id);
                            }
                        );
                    }
                );
            };
            /**
             * takaisin edelliselle sivulle
             */
            $scope.back = function () {
                $location.path('/');
            };

            $scope.accordianState = function(theme){
                for (var hkIndx = 0, hkkohdeLength = theme.hkkohde.length; hkIndx < hkkohdeLength; hkIndx+=1){
                    if (theme.hkkohde[hkIndx].additionalQuestions !== undefined && theme.hkkohde[hkIndx].additionalQuestions.length > 0){
                        return true;
                    }
                }
                return false;
            };

            $scope.lisaaSaanto = function (hkKysymysLista) {
                console.log('Tähän avataan dialogi säännöille ');
                console.log(hkKysymysLista);
                $modal.open({
                    templateUrl: 'partials/lisakysymykset/lisaa-saanto.html',
                    controller: 'addRuleCtrl',
                    resolve:{
                        hkKysymysLista: function () {
                            return hkKysymysLista;
                        }
                    }
                }).result.then(function (data) {
                        console.log('##', data);
                        hkKysymysLista = data;
                    });

            }
        }]);