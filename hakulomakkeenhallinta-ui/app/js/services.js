'use strict';

/* Services */
//var services = angular.module('hakulomakkeenhallinta.services', []);

/*services.service('Resources', ['$resource',
    function($resource) {
        return {
            applicationOptions: $resource('http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-ui/app/test-data/applicationOptions.json'),
            additionalQuestions: $resource('http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-ui/app/test-data/additionalQuestions.json'),
            languages: $resource('http://itest-virkailija.oph.ware.fi:8325/hakulomakkeenhallinta-ui/app/test-data/languages.json')
        };
    }
]);*/
/*services.service('FormWalker', ['_', function(_) {

        var walker = _.walk(function(e) {
            return e.children;
        });

        this.find = function(root, predicate) {
            return walker.find(root, predicate);
        };

        this.filter = function(root, predicate) {
            return walker.filter(root, _.walk.preorder, predicate);
        };

        this.filterByType = function(root, type) {
            return this.filter(root, function(el) {
                return el._class && el._class.indexOf(type) != -1;
            });
        };
    }
]);*/


/*services.service('Koodisto', function($http, $q, _, Config) {
    var baseUrl = 'https://itest-virkailija.oph.ware.fi/koodisto-service/rest/json';

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
    };
});*/

/*services.service('HH', ['$http', 'ASFResource', 'FormWalker', '_',
    function($http, ASFResource, FormWalker, _) {
        var applicationSystems = ASFResource.query();

        this.listApplicationSystems = function() {
            return applicationSystems;
        };
        this.find = function(applicationSystem, predicate) {
            return FormWalker.find(applicationSystem.form, predicate);
        };
        this.getApplicationSystem = function(id) {
            return _.find(applicationSystems, function(as) {
                return as._id === id;
            });
        };

        this.getOrganization = function() {
            return {
                'i18nText': {
                    'translations': {
                        'fi': 'k-kauppa'
                    }
                }
            };
        };

        this.searchApplicationOptions = function(asid, term) {
            var applicationOptions = [];
            $http.get("https://itest-virkailija.oph.ware.fi:443/tarjonta-service/rest/v1/hakukohde/search", {
            //$http.get("https://virkailija.opintopolku.fi/tarjonta-service/rest/v1/hakukohde/search", {
                params: {
                    searchTerms: term
                }
            }).success(function(data) {
                _.each(data.result.tulokset, function(org) {
                    _.each(org.tulokset, function(ao) {
                        applicationOptions.push(ao);
                    });
                });
            });
            return applicationOptions;
        };
    }
]);*/
