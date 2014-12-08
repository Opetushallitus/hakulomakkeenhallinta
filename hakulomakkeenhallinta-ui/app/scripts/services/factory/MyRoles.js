'use strict';
angular.module('hakulomakkeenhallintaUiApp.services.factory',[])
    .factory('MyRoles', [ '$q', '$http', 'Props', '_', function ($q, $http, Props, _) {
        var myroles = {};
        /**
         * hakee cas/myroles profiili tiedoston palvelusta /cas/myroles:sta
         * @returns {promise}
         */
        var getMyRoles = function () {
            var deferred = $q.defer();
            var instance = {};
            instance.myroles = [];

            $http.get(Props.casurl).success(function (result) {
                    instance.myroles = result;
                    deferred.resolve(instance);
                }
            ).error(function () {
                    deferred.reject();
                }
            );
            return deferred.promise;
        };
        /**
         * Palauttaa käyttäjän käyttökielen ( fi | sv | en )cas/myroles:sta oletus kieli on fi
         * @returns {promise}
         */
        myroles.getUserLang = function () {
            var deferred = $q.defer();
            getMyRoles().then(
                function (data) {
                    // oletus kieli fi, jos käyttäjällä ei kieltä asetettu cas/myroles:ssa
                    var userLang = 'fi';
                    userLang = _.find(data.myroles, function (ulng) { return ulng.match('LANG_'); }).slice(5);
                    deferred.resolve(userLang);
                }
            );
            return deferred.promise;
        };
        /**
         * Tarkastaa onko käyttäjän cas/myroles:ssa oikeaa käyttäjä profiilia
         * käyttämään hakulomakkeen hallintaa palauttaa datana true/false
         * @returns {promise}
         */
        myroles.accessRightCheck = function () {
            var deferred = $q.defer();
            getMyRoles().then(
                function (data) {
                    var access = _.some(data.myroles, function (hhaccess) { return hhaccess.match('APP_HAKULOMAKKEENHALLINTA'); });
                    deferred.resolve(access);
                }
            );
            return deferred.promise;
        };

        return myroles;
    }]);
