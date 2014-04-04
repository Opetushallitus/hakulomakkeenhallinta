'use strict';

/* Services */
var services = angular.module('hakulomakkeenhallinta.services', []);

services.service('Resources', ['$resource', function ($resource) {
    return {
        form:                       $resource('http://localhost:8000/app/test-data/form.json'),
        applicationSystem:          $resource('http://localhost:8000/app/test-data/db-applicationSystem.json'),
        applicationSystems:         $resource('http://localhost:8000/app/test-data/applicationSystems.json'),
        applicationFormTemplates:   $resource('http://localhost:8000/app/test-data/applicationFormTemplates.json'),
        applicationOptions:         $resource('http://localhost:8000/app/test-data/applicationOptions.json'),
        additionalQuestions:        $resource('http://localhost:8000/app/test-data/additionalQuestions.json'),
        types:                      $resource('http://localhost:8000/app/test-data/types.json'),
        languages:                  $resource('http://localhost:8000/app/test-data/languages.json')
    };
}]);



services.service('_', [function () {
    return window._;
}]);

services.service('Koodisto', function($http, $q, _, Config) {
    var baseUrl = 'https://itest-virkailija.oph.ware.fi/koodisto-service/rest/json';

    this.getKoodistot = function() {
        var deferred = $q.defer();
        $http.get(baseUrl).success(function (koodistot) {
            var d = _.reduce(koodistot, function(ctx, koodistoRyhma) {
            console.log("ryhmät " + koodistoRyhma.koodistoRyhmaUri);
               ctx.concat(_.reduce(koodistoRyhma.koodistos, function(ctx2, koodisto){
                    ctx.push({
                        id: koodisto.koodistoUri,
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
    }
    this.getKoodisto = function(koodisto) {
        var deferred = $q.defer();
        $http.get(Config.koodistoUrl + koodisto + '/koodi/')
            .success(function (data) {
                deferred.resolve(_.map(data, function(koodi) {
                    return {
                        id : koodi.koodiArvo,
                        i18nText: _.reduce(koodi.metadata, function(memo, meta) {
                                        memo[meta.kieli] = meta.nimi;
                                        return memo;
                                    }, {})
                    }
                }));
            });
        return deferred.promise;
    }
})

services.service('AS', function($http, $q) {
    var deferred = $q.defer();
    $http.get('http://localhost:8000/app/test-data/db-applicationSystem.json')
        .success(function (data) {
            deferred.resolve(data);
        });

    this.getASS = function() {
        return deferred.promise;
    }
})

services.service('HH', ['$http', 'AS', '_', function ($http, AS, _) {
    var applicationSystems = [];
    var asPromise = AS.getASS();
    var formWalker = _.walk(function(e) {
            return e.children;
    });

    asPromise.then(function(result) {
       applicationSystems.push(result);
    });

    this.listApplicationSystems = function() {
        return applicationSystems;
    };

    this.getApplicationSystem = function(id) {
        var applicationSystemForm =  _.find(applicationSystems, function(as) {
            return as._id === id;
        });
        return applicationSystemForm;
    };
    this.find = function(applicationSystem, predicate) {
        return formWalker.find(applicationSystem.form, predicate);
    };

    this.getOrganization = function()  {
        return {'i18nText' : {'translations' : {'fi' : 'k-kauppa'}}};
    };

    this.searchApplicationOptions = function(asid, term) {
        var applicationOptions = [];
        $http.get("https://itest-virkailija.oph.ware.fi:443/tarjonta-service/rest/v1/hakukohde/search",
                {params: {searchTerms: term}} )
            .success(function (data) {
                _.each(data.result.tulokset, function(org) {
                   _.each(org.tulokset, function(ao) {
                        applicationOptions.push(ao);
                   })
            })
        });
        return applicationOptions
    };
}]);
