'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('Organisaatio',[ '$resource', 'Props', '$q', function ($resource, Props, $q) {

        var hae =  $resource(Props.organisaatioService+'/rest/organisaatio/:_oid',
            {_oid:'@_oid'}, {}
        );
        var organisaatio ={};
        var _organisation = {};

        organisaatio.setOrganisation = function(organization){
            _organisation = organization;
        };

        organisaatio.getOrganisation = function() {
            return _organisation;
        };

        /**
         * Palautaa organisaation id:llä, jos organisaatio ei ole muistissa
         * tehdään uudelleen haku organisaation palveluun organisaation oid:lla
         * @param oid: organisaation id
         * @returns {promise}: palauttaa organisaation
         */
        organisaatio.fetchOrganisation = function(oid){
            var defferred = $q.defer();
            if(_organisation != undefined && _organisation.oid != undefined){
                if( _organisation.oid == oid){
                    defferred.resolve(_organisation);
                }
            }
            hae.get({'_oid':oid}).$promise.then(
                function(data){
                    defferred.resolve(data);
                });
            return defferred.promise;
        };


        return organisaatio;
    }]);


