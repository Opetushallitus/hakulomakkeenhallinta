'use strict';

angular.module('hakulomakkeenhallintaUiApp.filters')
    .filter('hakutyyppiNimi', [ '_',  function (_) {
        return function(type, hakutyypit, userLang) {
            if (hakutyypit && hakutyypit.length > 0) {
                if (!userLang) {
                    userLang = 'fi';
                }
                var hakutyyppiObj =_.find(hakutyypit, function (hkt) { return hkt.type === type; });
                if (hakutyyppiObj.translations && hakutyyppiObj.translations[userLang]) {
                    return hakutyyppiObj.translations[userLang];
                } else {
                    return undefined;
                }
            }
            return "";
        };
    }]);