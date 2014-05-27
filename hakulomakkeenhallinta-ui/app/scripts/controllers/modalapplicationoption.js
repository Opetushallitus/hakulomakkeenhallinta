'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')

.controller('ModalApplicationOptionCtrl', ['$scope', '$location', '$modalInstance', 'applicationSystemForm', 'HH', 'QuestionData', 'OrganisaatioHenkilo',
    function($scope, $location, $modalInstance, applicationSystemForm, HH, QuestionData, OrganisaatioHenkilo ) {
        $scope.applicationOptions = [];
        $scope.queryParameters = {};
        $scope.applicationSystemForm = applicationSystemForm;
        $scope.organisations = [];

        OrganisaatioHenkilo.get().$promise.then(function(data){
          var userOrganizations = [];
            for(var org  in data.organisaatiot){
                var organisation = {};
                organisation.oid = data.organisaatiot[org].oid;
                organisation.nimi = data.organisaatiot[org].nimi;
                userOrganizations.push(organisation);
            }
            $scope.organisations = userOrganizations;
            if($scope.organisations.length == 1){
                $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, $scope.organisations[0].oid);
            }
        });

        //TODO: tämä localhost hack poista!!
        /*var orgs = ["1.2.246.562.10.82388989657", "1.2.246.562.10.65530732232", "67877877" ];
//        var orgs = [ "1.2.246.562.10.65530732232"];
        var mod = [];
        for(var o in orgs){
            var r ={};
            r.oid = orgs[o];
            var ni ={};
            ni.fi ='oidi_'+o;
            r.nimi = ni;
            mod.push(r);
        }
        console.log(mod);
        $scope.organisations = mod;

        if($scope.organisations.length == 1){
            console.log('#####', mod[0].oid);
            $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, mod[0].oid);
        }*/

        $scope.selectedOrganisation = function(){
            var org = [];
            if(this.organisation !==null){
                org.push(this.organisation.oid);
                $scope.applicationOptions = HH.usersApplicationOptions($scope.applicationSystemForm._id, org);
            }
        };

        $scope.ok = function() {
            QuestionData.setApplicationOption(this.applicationOption);
            $modalInstance.close(this.applicationOption.oid);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
       /* $scope.search = function() {
//            $scope.applicationOptions = HH.searchApplicationOptions(applicationSystemForm._id, $scope.queryParameters.term);
//            $scope.applicationOptions = HH.searchApplicationOptions(applicationSystemForm._id, $scope.userOrganizations, $scope.queryParameters.term);
        };*/
    }
]);
