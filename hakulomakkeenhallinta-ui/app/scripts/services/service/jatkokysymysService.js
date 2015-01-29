"use strict";

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('JatkokysymysService', [ '$rootScope', '$modal',
        function ($rootScope, $modal) {

            var _jatkokysymysObj = undefined,
                _parentQuestion = undefined;
            /**
             * Function jatkokysymys dialogin avaamiseksi
             * @param jatkokysymysObj
             */
            this.lisaaJatkokysymys = function (jatkokysymysObj) {
                _jatkokysymysObj = jatkokysymysObj;
                $modal.open({
                    templateUrl: 'partials/dialogs/lisaa-jatkokysymys.html',
                    controller: 'jatkoKysymysDialogCtrl',
                    scope: jatkokysymysObj.scope
                }).result.then(function (data) {
                        $rootScope.LOGS('Jatkokysymys dialogin tuottama data: ', data);
                        jatkokysymysObj.kysymykset = data;
                    }
                );
            };
            /**
             * asettaa olion _jatkokysymysObj:hin
             * @param jtksObj jatkokysys objecti
             */
            this.setJatkokysymysObj = function (jtksObj) {
                $rootScope.LOGS('JatkokysymysService', 'setJatkokysymysObj()', jtksObj);
                _jatkokysymysObj = jtksObj;
            };
            /**
             * Palauttaa _jatkokysymysObj:n
             * @returns {} jatkokysymys objecti
             */
            this.getJatkokysymysObj = function () {
                return _jatkokysymysObj;
            };
            /**
             * palauttaa parent kysymys
             * objektin
             * @returns {undefined}
             */
            this.getParentQuestion = function () {
                return _parentQuestion;
            }
            /**
             * asetetaan olio _parentQuestion muuttujaan
             * @param parentQ parent kysymys olio
             */
            this.setParentQuestion = function (parentQ) {
                _parentQuestion = parentQ;
            }
        }
    ]);