'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('HakulomakkeetListaCtrl', ['$scope', '$rootScope', '$modal', '$log', '$location', 'FormEditor', '_', '$filter', 'Koodisto', 'Organisaatio', '$cookies', 'LomakepohjanAsetuksetService',
        function ($scope, $rootScope, $modal, $log, $location, FormEditor, _, $filter, Koodisto, Organisaatio, $cookies, LomakepohjanAsetuksetService) {
            $rootScope.LOGS('HakulomakkeetListaCtrl');

            $scope.applicationForms = [];
            $scope.statukset = [];
            $scope.vuodet = [];
            $scope.kaudet = [];
            $scope.hakutyypit = [];
            $scope.search = $cookies.formListSearch;

            $scope.setSearchToCookie = function () {
                $cookies.formListSearch = $scope.search;
            };
            $scope.$emit('LOADPAGE');
            /**
             * haetaan hakulomakkeet lista
             */
            FormEditor.getApplicationSystemForms().then(
                function (data) {

                    $scope.statukset = _.uniq(_.map(data, function (status) { return status.status.translations[$scope.userLang]; }));
                    $scope.statukset.push('');
                    $scope.statukset =  $filter('orderBy')($scope.statukset, 'toString()');

                    $scope.vuodet = _.uniq(_.map(data, function (vuosi) { return vuosi.year; }));
                    $scope.vuodet.push('');
                    $scope.vuodet =  $filter('orderBy')($scope.vuodet, 'toString()');

                    Koodisto.getKausiKoodit().then(
                        function (kausiKoodit) {
                            kausiKoodit.push({period: ''});
                            $scope.kaudet =  $filter('orderBy')(kausiKoodit, 'period');
                        }
                    );
                    Koodisto.getHakutyyppiKoodit().then(
                        function (hakutyyppiKoodit) {
                            hakutyyppiKoodit.push(
                                {
                                    translations: {
                                        fi: '',
                                        sv: ''
                                    }
                                }
                            );
                            $scope.hakutyypit = $filter('orderBy')(hakutyyppiKoodit, 'translations.' + $scope.userLang);
                        }
                    );
                    $scope.$emit('LOADPAGEREADY');
                    $scope.applicationForms = data;

                }
            );

            $scope.hakukohdeKohtaisetLisakysymykset = function (applicationSystemForm) {
                $location.path("/themeQuestionsByOrganisation/" + applicationSystemForm._id + '/' + Organisaatio.getUserSelectedOrganisation().oid);
            };
            /**
             * Avaa dialogin haun ja lomakepohjan yhdistämiselle
             * hakemuslomakkeeksi
             */
            $scope.luoUusiHakemuslomake = function () {
                $rootScope.LOGS('HakulomakkeetListaCtrl', 'luoUusiHakemuslomake()', Organisaatio.getUserSelectedOrganisation().nimi);
                $modal.open({
                    templateUrl: 'partials/dialogs/luo-hakulomake.html',
                    controller: 'LuoHakemuslomakeCtrl',
                    scope: $scope,
                    resolve: {
                        lomakkeidenVuodet: function () {
                            return $scope.vuodet;
                        }
                    }
                });
            };

            $scope.lomakepohjanAsetukset = function (applicationForm) {
                console.log(applicationForm);
                $location.path("/applicationSystemFormConfigurations/" + applicationForm._id + '/' + Organisaatio.getUserSelectedOrganisation().oid);
                //LomakepohjanAsetuksetService.lomakepohjanAsetukset(applicationForm, $scope);
            };
        }
    ]);
