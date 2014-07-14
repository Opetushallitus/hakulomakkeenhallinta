'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service', [])
  .service('Koodisto', ['$http', '$q', '$rootScope', 'Props',
        function Koodisto($http, $q, $rootScope, Props) {
            $rootScope.LOGS('Koodisto');
//        var baseUrl = 'https://itest-virkailija.oph.ware.fi/koodisto-service/rest/json';
/*
        this.getKoodistot = function() {
            var deferred = $q.defer();
            $http.get(baseUrl).success(function(koodistot) {
                var d = _.reduce(koodistot, function(ctx, koodistoRyhma) {
                    console.log("ryhmät " + koodistoRyhma.koodistoRyhmaUri);
                    ctx.concat(_.reduce(koodistoRyhma.koodistos, function(ctx2, koodisto) {
                        ctx.push({
                            id: koodisto.koodistoUri,
                            group: koodistoRyhma.koodistoRyhmaUri,
                            i18nText: _.reduce(koodisto.latestKoodistoVersio.metadata, function(memo, meta) {
                                memo[meta.kieli] = meta.nimi;
                                return memo;
                            }, {})
                        });
                        return ctx2;
                    }, ctx));
                    return ctx;
                }, []);
                deferred.resolve(d);

            });
            return deferred.promise;
        };
        this.getKoodisto = function(koodisto) {
            var deferred = $q.defer();
            $http.get(Config.koodistoUrl + koodisto + '/koodi/')
                .success(function(data) {
                    deferred.resolve(_.map(data, function(koodi) {
                        return {
                            id: koodi.koodiArvo,
                            i18nText: _.reduce(koodi.metadata, function(memo, meta) {
                                memo[meta.kieli] = meta.nimi;
                                return memo;
                            }, {})
                        };
                    }));
                });
            return deferred.promise;
        };*/


        this.getPostiKoodit = function(){
            $rootScope.LOGS('getPostiKoodit()');
            var deferred = $q.defer();
            $http.get(Props.koodisto+'/posti/koodi?onlyValidKoodis=true').success(
                function(data){
                    deferred.resolve(data);
                });
            return deferred.promise;
        }
    }]);
