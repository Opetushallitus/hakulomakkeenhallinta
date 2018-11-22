'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('kausiNimi', [ '_',  function (_) {
        return function(kausi, kaudet, userLang) {
            if (kaudet && kaudet.length > 0) {
                if (!userLang) {
                    userLang = 'fi';
                }
                var kausiObj =_.find(kaudet, function (k) { return k.period === kausi; });
                if (kausiObj && kausiObj.translations && kausiObj.translations[userLang]) {
                    return kausiObj.translations[userLang];
                } else if (kausiObj && kausiObj.translations) {
                    if (kausiObj.translations.fi) {
                        return kausiObj.translations.fi;
                    }
                    if (kausiObj.translations.sv) {
                        return kausiObj.translations.sv;
                    }
                    if (kausiObj.translations.en) {
                        return kausiObj.translations.en;
                    }
                    return undefined;
                } else {
                    return undefined;
                }
            }
            return "";
        };
    }]);