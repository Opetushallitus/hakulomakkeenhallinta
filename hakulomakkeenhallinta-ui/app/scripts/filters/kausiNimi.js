'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('kausiNimi', [ '_',  function (_) {
        return function(kausi, kaudet, userLang) {
            if (kaudet && kaudet.length > 0) {
                if (!userLang) {
                    userLang = 'fi';
                }
                var kausiObj =_.find(kaudet, function (k) { return k.period === kausi; });
                if (kausiObj.translations && kausiObj.translations[userLang]) {
                    return kausiObj.translations[userLang];
                } else {
                    return undefined;
                }
            }
            return "";
        };
    }]);