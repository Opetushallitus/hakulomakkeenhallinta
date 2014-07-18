'use strict';

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('LiitepyyntoData', [ 'FormEditor','$rootScope', 'ThemeQuestions', '$q', 'TarjontaAPI',
        function (FormEditor, $rootScope, ThemeQuestions, $q, TarjontaAPI ) {
            $rootScope.LOGS('LiitepyyntoData');
            var _attachmentRequests = {},
                _editFlag = false;
            /**
             * luo alustuksen uudelle liitekysymys oliolle
             */
            this.createNewLiitepyynto = function(optionId){
                $rootScope.LOGS('createNewLiitepyynto()');
                _attachmentRequests = {};
                _attachmentRequests.attachedToOptionId = optionId;
                _attachmentRequests.header = {};
                _attachmentRequests.header.translations = {};
                _attachmentRequests.description = {};
                _attachmentRequests.description.translations = {};
                _attachmentRequests.deliveryDue ='';
                _attachmentRequests.deliveryAddress = {};
                return _attachmentRequests;
            };
            /**
             * asetaan liitepyynnön tiedot muuttujaan
             * @param attachmentRequests
             */
            this.setLiitepyynto = function(attachmentRequests){
                this.setEditFlag(true);
                _attachmentRequests = attachmentRequests;
            }
            /**
             * palautetaan liitepyynnön tiedot muuttujasta
             * @returns {{}}
             */
            this.getLiitepyynto = function(){
                return _attachmentRequests;
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

