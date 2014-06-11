'use strict';
var CAS_URL = '/cas/myroles';

angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('MyRoles', function ($q, $http) {
        var myroles = {};

        var getMyRoles = function(){
            var deferred = $q.defer();
            var instance = {};
            instance.myroles = [];

            $http.get(CAS_URL).success(function(result) {
                instance.myroles = result;
                deferred.resolve(instance);
            }).error(function(){
                deferred.reject();
            });
            return deferred.promise;
        };

        myroles.getUserLang = function(){
            var deferred = $q.defer();
            getMyRoles().then(
                function(data){
                    var found = true;
                    // oletus kieli fi, jos käyttäjällä ei kieltä asetettu cas/myroles:ssa
                    var userLang = 'fi';
                    for(var i=0 ; i < data.myroles.length && found ; i++ ){
                        if( data.myroles[i].match("LANG_") !== null){
                            userLang = data.myroles[i].slice(5);
                            found = false;
                        }
                    }
                    deferred.resolve(userLang);
                }
            );
            return deferred.promise;
        };

        myroles.accessRightCheck = function(){
            var deferred = $q.defer();
            getMyRoles().then(
                function(data){
                    if( data.myroles.indexOf("APP_HAKULOMAKKEENHALLINTA") != -1){
                        deferred.resolve(true);
                    }else{
                        deferred.resolve(false);
                    }
                });
            return deferred.promise;
        };

        return myroles;
    });
