'use strict';
angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('lisakysymysOikeudetService', [ 'FormEditor', 'MyRoles', '$routeParams', '_', '$rootScope',
    function (FormEditor, MyRoles, $routeParams, _, $rootScope) {

        this.haunHakuajat = [];
        this.isRekisterinpitaja = false;
        var _this = this;

        /**
         * Haetaan haun hakuajat
         */
        FormEditor.getApplicationSystemFormApplicationPeriods($routeParams.id).then(
            function (data) {
                _this.haunHakuajat = data;
                $rootScope.LOGS('lisakysymysOikeudetService', 'haunHakuajat: ', data);
            }
        );
        /**
         * Tarkistetaan, onko käyttäjälle rekisterinpitäjän oikeudet
         */
        MyRoles.rekisterinpitajaRightCheck().then(
            function(data) {
                _this.isRekisterinpitaja = data;
                $rootScope.LOGS('lisakysymysOikeudetService', 'isRekisterinpitaja: ', data);
            }
        );

        this.isBeforeFirstHakuaika = function() {
            return new Date() < _.min(_.map(this.haunHakuajat, function(ha) {return ha.start}));
        };

        this.isHakuaikaGoing = function() {
            const now = new Date();
            return _.some(this.haunHakuajat, function(ha) {return ha.start <= now && now <= ha.end})
        };

        this.isKysymyksenMuokkausSallittu = function() {
            return this.isRekisterinpitaja || this.isBeforeFirstHakuaika();
        };

        this.isKysymyksenLisaysSallittu = function() {
            return this.isRekisterinpitaja || !this.isHakuaikaGoing();
        };
    }]);
