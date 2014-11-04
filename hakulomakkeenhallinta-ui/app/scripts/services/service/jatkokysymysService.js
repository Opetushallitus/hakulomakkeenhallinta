"use strict";

angular.module('hakulomakkeenhallintaUiApp.services.service')
    .service('JatkokysymysService', [ '$rootScope', '$modal',
        function ($rootScope, $modal) {

            var _jatkokysymysObj = undefined;
            /**
             * Function jatkokysymys dialogin avaamiseksi
             * @param jatkokysymysObj
             */
            this.lisaaJatkokysymys = function (jatkokysymysObj) {
                console.log('JatkokysymysService', 'lisaaJatkokysymys', 'Jatkokysymys dialogin avaus ');
                console.log('Teema: ', jatkokysymysObj.teema);
                console.log('Hakukohde: ',jatkokysymysObj.hakukohde);
                console.log('Kysymykset: ', jatkokysymysObj.kysymykset);
                console.log('Vastaus: ', jatkokysymysObj.vastaus);
                console.log('jatkokysymys Objecti: ', jatkokysymysObj);
                _jatkokysymysObj = jatkokysymysObj;
                $modal.open({
                    templateUrl: 'partials/dialogs/lisaa-jatkokysymys.html',
                    controller: 'jatkoKysymysDialogCtrl',
                    scope: jatkokysymysObj.scope,
                    resolve: {
                        jatkokysymysObj: function () {
                            return jatkokysymysObj;
                        }
                    }
                }).result.then(function (data) {
                        console.log('Jatkokysymys dialogin tuottama data: ', data);
                        jatkokysymysObj.kysymykset = data;
                    }
                );

            };

            this.setJatkokysymysObj = function (jtksObj) {
                console.log('JatkokysymysService', 'setJatkokysymysObj()', jtksObj);
                _jatkokysymysObj = jtksObj;
            };

            this.getJatkokysymysObj = function () {
                return _jatkokysymysObj;
            };
        }
    ]);