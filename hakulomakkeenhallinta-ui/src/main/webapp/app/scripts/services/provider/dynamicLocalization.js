'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.provider')
    .provider('dynamicLocalization', function () {

        var localeLocationPattern = 'lib/angular/i18n/angular-locale_{{locale}}.js';

        function overrideValues(oldObject, newObject) {
            angular.forEach(newObject, function(value, key) {
                if (angular.isArray(newObject[key]) || angular.isObject(newObject[key])) {
                    overrideValues(oldObject[key], newObject[key]);
                } else {
                    oldObject[key] = newObject[key];
                }
            });
        }

        function loadScript(localeUrl, callback) {
            // muuttujat sivun dom-elementeille
            var script = document.createElement('script'),
                body = document.getElementsByTagName('body')[0];

            script.type = 'text/javascript';
            // jos script-elementti sisältää readyState-kentän,
            if (script.readyState) { // kyseessä on IE
                // event-listener readyState-kentän muutoksille
                script.onreadystatechange = function () {
                    // jos script-elementin tila on 'loaded' tai 'complete'
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null; // eventin nollaus
                        callback(); // ks. callback funktio loadScriptin kutsusta alla
                    }
                };
            } else { // muu selain
                // event-listener scriptin onload-tapahtumalle
                script.onload = function () {
                    callback(); // ks. callback funktio loadScriptin kutsusta alla
                };
            }
            script.src = localeUrl;
            script.async = false;
            body.appendChild(script); // lisätään lokaalia vastaava javascript-elementti bodyyn
        }

        function loadLocale(localeUrl, $locale){
            loadScript(localeUrl, function () {
                var localInjector = angular.injector(['ngLocale']),
                    externalLocale = localInjector.get('$locale');
                overrideValues($locale, externalLocale);
            });
        }

        this.$get = ['$interpolate', '$locale', function($interpolate, $locale) {
            var localeLocation = $interpolate(localeLocationPattern);
            return {
                set: function(value) {
                    return loadLocale(localeLocation({locale: value}), $locale);
                }
            };
        }];
    });

