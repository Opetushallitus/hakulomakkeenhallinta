'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SelectHakukohdeCtrl', ['$scope', '$location', '$modalInstance','QuestionData',
        function($scope, $modalInstance, QuestionData ) {

            $scope.hakuOid;

            $scope.jatka = function(hakukohde) {
                console.log('-- jatka -- ',hakukohde);
                QuestionData.setApplicationOption(hakukohde);
                $scope.hakuOid = hakukohde.oid;
                QuestionData.setLearningOpportunityId(hakukohde.oid);
                $modalInstance.close(hakukohde.oid);
            };

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };

        }]);

