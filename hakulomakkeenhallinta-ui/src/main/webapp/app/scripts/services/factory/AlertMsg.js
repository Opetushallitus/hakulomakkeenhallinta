'use strict';
angular.module('hakulomakkeenhallintaUiApp.services.factory')
    .factory('AlertMsg', [ '$timeout', function ($timeout) {
    // model on halutun $scopen alta löytyvä dataolio, jonka alerts-taulukko sisältää tulostettavat alertit
    // type on alert-viestin tyyppi: joko 'warning', 'success' tai 'info'
    // key on avain, jolla alert-viesti haetaan käännös palvelusta
    return function(model, type, key) {
        if (!model.alerts) {
            model.alerts = [];
        }
        var icon;
        if (type === 'success') {
            icon = 'ok';
        } else {
            icon = type;
        }
        model.alerts.push({
            type: type,
            msg : key,
            icon: icon
        });
        // success- ja info-tyyppiset alertit poistetaan automaattisesti 10 s kuluttua
        if (type == 'success' || type == 'info') {
            var index = model.alerts.length - 1;
            $timeout(function () {
                model.alerts.splice(index, 1);
            }, 10000);
        }

    }
}]);
