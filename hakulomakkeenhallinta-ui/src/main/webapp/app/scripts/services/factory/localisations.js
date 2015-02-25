'use strict';
/**
 * Hakee käännöspalvelusta resurssit sovelluksen lokalisointiin
 */
angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('Localisations',[ '$resource', 'Props','$q', function ($resource, Props, $q) {
        var localisations ={};
        var locals = $resource(Props.localizationUrl+'/localisation',{},{
            query: {
                method:'GET',
                params:{
                    category: 'hakulomakkeenhallinta'
                },
                isArray: true
            }
        });
        /**
         * Haetaan lokalisoinnit käännöspalvelusta
         * palauttaa käännösten objekti taulukon.
         * @returns {promise}
         */
        localisations.getLocalisations = function(){
            var deferred = $q.defer();
            locals.query().$promise.then(function(data){
                deferred.resolve(data);
            });
            return deferred.promise;
        };
        return localisations;
    }]);