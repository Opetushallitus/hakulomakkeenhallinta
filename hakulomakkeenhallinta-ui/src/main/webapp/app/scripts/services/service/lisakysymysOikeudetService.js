'use strict';
angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('lisakysymysOikeudetService', [ 'FormEditor', 'MyRoles', '$routeParams', '_', '$rootScope',
    function (FormEditor, MyRoles, $routeParams, _, $rootScope) {

        this.haunHakuajat = [];
        this.haunHakutapa = "";
        this.isRekisterinpitaja = false;
        var _this = this;

        /**
         * Haetaan haun hakuajat ja hakutapa
         */
        FormEditor.getApplicationSystemFormHakuajatJaHakutapa($routeParams.id).then(
            function (data) {
                $rootScope.LOGS('lisakysymysOikeudetService', 'haunHakuajatJaHakutapa: ', data);
                _this.haunHakuajat = data.hakuajat;
                _this.haunHakutapa = data.hakutapa;
                $rootScope.LOGS('lisakysymysOikeudetService', 'haunHakuajat: ', _this.haunHakuajat);
                $rootScope.LOGS('lisakysymysOikeudetService', 'haunHakutapa: ', _this.haunHakutapa);
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

        this.isYhteishaku = function() {
            return "hakutapa_01" == this.haunHakutapa;
        };

        this.isBeforeFirstHakuaika = function() {
            return new Date() < _.min(_.map(this.haunHakuajat, function(ha) {return ha.start}));
        };

        this.isHakuaikaGoing = function() {
            var now = new Date();
            return _.some(this.haunHakuajat, function(ha) {return ha.start <= now && now <= ha.end})
        };

        this.isKysymyksenPoistoSallittu = function() {
            return this.isYhteishaku() ? this.isRekisterinpitaja || this.isBeforeFirstHakuaika() : true;
        };

        this.isKysymyksenLisaysTaiMuokkausSallittu = function() {
            return this.isYhteishaku() ? this.isRekisterinpitaja || !this.isHakuaikaGoing() : true;
        };
    }]);
