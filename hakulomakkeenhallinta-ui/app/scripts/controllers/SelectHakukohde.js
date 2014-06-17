'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectHakukohdeCtrl', ['$scope', '$rootScope', '$location', '$modalInstance', 'TarjontaAPI', 'QuestionData','$routeParams', 'applicationSystem', 'FormEditor', 'AlertMsg',
        function($scope, $rootScope, $location, $modalInstance, TarjontaAPI, QuestionData, $routeParams, applicationSystem, FormEditor, AlertMsg ) {
            $rootScope.LOGS('SelectHakukohdeCtrl ');
            $scope.applicationOptions = [];
            $scope.$emit('LOAD');
            $scope.applicationSystem = applicationSystem;

            if(applicationSystem === undefined){
                /**
                 * haetaan valitun hakulomakkeen tiedot hakulomakkeen Id:llä
                 */
                FormEditor.fetchApplicationSystemForm($routeParams.id).then(
                    function(data){
                        $scope.applicationSystem = data;
                    });
            };
            /**
             * Haetaa hakulomakkeeseen ja käyttäjän organisaation liittyvät hakukohteet
             */
            TarjontaAPI.usersApplicationOptions($routeParams.id, $routeParams.oid).then(
                function(data){
                    $scope.$emit('LOADREADY');
                    if(data.length != 0){
                        $scope.applicationOptions = data;
                    }else{
                        AlertMsg($scope, 'warning','organisaatiossa.ei.hakukohdetta.hakukohdejoukko');
                    }
                });

            $rootScope.LOGS('SelectHakukohdeCtrl', $scope.applicationOptions);
            $scope.jatka = function(hakukohde) {
                $rootScope.LOGS('SelectHakukohdeCtrl','jatka()',hakukohde);
                QuestionData.setApplicationOption(hakukohde);
                $modalInstance.close(hakukohde.oid);
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

        }]);

