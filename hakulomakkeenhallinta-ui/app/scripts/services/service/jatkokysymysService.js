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
                /*console.log('JatkokysymysService', 'lisaaJatkokysymys', 'Jatkokysymys dialogin avaus ');
                console.log('Teema: ', jatkokysymysObj.teema);
                console.log('Hakukohde: ', jatkokysymysObj.hakukohde);
                console.log('Kysymykset: ', jatkokysymysObj.kysymykset);
                console.log('Vastaus: ', jatkokysymysObj.vastaus);
                console.log('jatkokysymys Objecti: ', jatkokysymysObj);*/
                _jatkokysymysObj = jatkokysymysObj;
                $modal.open({
                    templateUrl: 'partials/dialogs/lisaa-jatkokysymys.html',
                    controller: 'jatkoKysymysDialogCtrl',
                    scope: jatkokysymysObj.scope
                }).result.then(function (data) {
                        console.log('Jatkokysymys dialogin tuottama data: ', data);
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

            this.getParentQuestion = function () {
                return _parentQuestion;
            }

            this.setParentQuestion = function (parentQ) {
                _parentQuestion = parentQ;
            }

        }
    ]);