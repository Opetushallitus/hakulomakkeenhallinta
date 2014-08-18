'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service', [])
    .service('Koodisto', ['$http', '$q', 'Props',
        function Koodisto($http, $q, Props) {
            var postinumerot = [];
            this.getPostiKoodit = function() {
                var deferred = $q.defer();
                if (postinumerot.length > 0) {
                    deferred.resolve(postinumerot);
                } else {
                    $http.get(Props.koodisto + '/posti/koodi?onlyValidKoodis=true').success(
                        function(data) {
                            postinumerot = data;
                            deferred.resolve(data);
                        });
                }
                return deferred.promise;
            };
        }
    ]);
