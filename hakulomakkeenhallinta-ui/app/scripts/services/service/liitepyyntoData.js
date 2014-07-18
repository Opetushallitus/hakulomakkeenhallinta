'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('LiitepyyntoData', [ 'FormEditor','$rootScope', 'ThemeQuestions', '$q', 'TarjontaAPI',
        function (FormEditor, $rootScope, ThemeQuestions, $q, TarjontaAPI ) {
            $rootScope.LOGS('LiitepyyntoData');
            var _liitePyynto = {},
                _editFlag = false;
            /**
             * luo alustuksen uudelle liitekysymys oliolle
             */
            this.createNewLiitepyynto = function(optionId){
                $rootScope.LOGS('createNewLiitepyynto()');
                _liitePyynto = {};
                _liitePyynto.id = optionId;
                _liitePyynto.liitenimi = {};
                _liitePyynto.liitekuvaus = {};
                _liitePyynto.toimitusmennessa ='';
                _liitePyynto.address = {};
                return _liitePyynto;
            };
            /**
             * asetaan liitepyynnön tiedot muuttujaan
             * @param liitePyynto
             */
            this.setLiitepyynto = function(liitePyynto){
                this.setEditFlag(true);
                _liitePyynto = liitePyynto;
            }
            /**
             * palautetaan liitepyynnön tiedot muuttujasta
             * @returns {{}}
             */
            this.getLiitepyynto = function(){
                return _liitePyynto;
            }
            /**
             * palautetaan liitepyynnön muokkaus lippu
             * @returns {boolean}
             */
            this.getEditFlag = function(){
                return _editFlag;
            }
            /**
             *asetetaan muokkaus lippu liitepyynnölle
             * @param flag true/false
             */
            this.setEditFlag = function(flag){
                _editFlag = flag;
            }
        }]);

