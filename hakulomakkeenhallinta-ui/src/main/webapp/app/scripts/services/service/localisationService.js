/**
 * Sovelluksen lokalisointi palvelu
 */
angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('LocalisationService',  [ 'Localisations', '$q', 'MyRoles', '$cacheFactory', '$sanitize',
        function(Localisations, $q, MyRoles, $cacheFactory, $sanitize){

            //välimuisti käännöksille
            var cache = $cacheFactory('locales');
            /**
             * Haetaan käännöspalvelusta käyttäjän käyttökielen mukaan
             * lokalisoidut käännökset ja laitetaan ne välimuistiin
             * avain arvo pareina
             * @param userLang : käyttäjän käyttökieli oletus arvo 'fi'
             * @returns {promise}
             */
              function getTranslations(userLang){
                var deferred = $q.defer();
                if(cache.info().size === 0){
                    Localisations.getLocalisations().then(function(data){
                        for(var trl in data){
                            if(data[trl].id !== undefined && data[trl].locale === userLang){
                                putCachedLocalisation(data[trl].key, data[trl].value );
                            }
                        }
                        deferred.resolve();
                    })
                };
                return deferred.promise;
            };
            /**
             * Palauttaa käännöstekstin avaimelle
             * @param key: käännöstekstin avain
             * @returns {promise}
             */
            this.getTranslation = function(key){
                var deferred = $q.defer();
                if(!hasTranslation(key)){
                    MyRoles.getUserLang().then(function(data){
                        getTranslations(data).then(function(){
                            var locale = cache.get(key);
                            deferred.resolve( locale ? cache.get(key) : undefined );
                        });
                    });
                }else{
                    var locale = cache.get(key);
                    deferred.resolve( locale ? cache.get(key) : undefined );
                }
                return deferred.promise;
            };
            /**
             * Laittaa käännöstekstit välimuistiin avain arvo pareine
             * @param key: käännöstekstin avain
             * @param newEntry: käännnösteksi
             */
            function putCachedLocalisation(key,newEntry) {
                cache.put(key, newEntry);
            };
            /**
             * Tarkistaa onko käännösteksti olemassa
             * @param key: käännöstekstin avain
             * @returns {*|boolean}
             */
            function hasTranslation(key){
                return angular.isDefined(cache.get(key));
            }

            /**
             * Palauttaa käännötekstin käännös avaimella
             * @param key: käännöksen avain
             * @param params: parametri taulukko parametrisoiduille käännöksille (optional)
             * @returns {*}
             */
            this.tl = function(key, params){
                if(hasTranslation(key) && params !== undefined){
                    var result = cache.get(key);
                    result = result.replace(/{(\d+)}/g, function(match, number){
                        return angular.isDefined(params[number]) ? params[number] : match;
                    });
                    return $sanitize(result);
                }else if(hasTranslation(key) && params === undefined){
                    return cache.get(key);
                }else{
                    return undefined;
                }
            };

        }]);
