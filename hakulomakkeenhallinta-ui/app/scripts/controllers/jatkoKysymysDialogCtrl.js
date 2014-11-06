'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('jatkoKysymysDialogCtrl', [ '$scope', '$modalInstance', '$filter', 'JatkokysymysService', '_',
        function ($scope, $modalInstance, $filter, JatkokysymysService, _) {

            var jatkokysymysObj = JatkokysymysService.getJatkokysymysObj(),
                kysymykset = jatkokysymysObj.kysymykset;
            $scope.kysymykset = kysymykset;
            $scope.valittukysymys = jatkokysymysObj.kysymys;
            $scope.vastaus = jatkokysymysObj.vastaus;
            $scope.vastauksenJatkoKysymykset = _.without(kysymykset, jatkokysymysObj.kysymys);

//            console.log('### \n', jatkokysymysObj, '\n ####');
            console.log('### kysymys: ', jatkokysymysObj.kysymys);
            console.log('### vastaus: ', jatkokysymysObj.vastaus);
            $scope.tallennettavatJatkokysymykset = [];
            $scope.jatkokysymysLista = [];

            var jatko = {};
            jatko.parentId = $scope.valittukysymys._id;
            jatko.condition = '';
            jatko.vastauksenJatkoKysymykset = $scope.vastauksenJatkoKysymykset;
            if ($scope.vastaus !== undefined) {
                jatko.condition = $scope.vastaus.id;
            }

            $scope.jatkokysymysLista.push(jatko);

            /**
             * Tallentaa jatkokysymykset valittuu
             * kysymyksen vastaukseen
             */
            $scope.tallennaJatkokysymykset = function () {
                console.log('GGGG ',kysymykset);
                //TODO: tähän jatkokysmysten tallennus kun bacend tukee sitä
                $modalInstance.close(kysymykset);
            };
            /**
             * Suljetaan jatkokysymys dialogi
             */
            $scope.cancel = function () {
                JatkokysymysService.setJatkokysymysObj(undefined);
                $modalInstance.dismiss('cancel');
            };
            /**
             * asetetaa valittu kysymys johon jatkokysymykset
             * liitetään
             * valitun kysymyksen suhteen
             */
            $scope.valittuKysymys = function () {
                $scope.vastaus = null;
                jatko.condition = '';
                if (this.valittukysymys !== null) {
                    $scope.vastauksenJatkoKysymykset = _.without(kysymykset, this.valittukysymys);
                    jatko.parentId = this.valittukysymys._id;
                } else {
                    jatko.parentId = '';
                }
            };
            /**
             * asetetaan kysymyksen vastaus johon jatkokysymykset
             * liitetään
             * @param vastaus
             */
            $scope.valittuVastaus = function (vastaus) {
                $scope.vastaus = vastaus;
                if (vastaus !== null) {
                    jatko.condition = vastaus.id;
                } else {
                    jatko.condition = '';
                }
            };

            /**
             * Luodaan uusi jatkokysymys
             */
            $scope.luoJatkokysymys = function () {
                console.log('## ', 'Luo uusi jatkokysymys ', jatkokysymysObj.kysymykset);
                console.log('## ', 'Luo uusi jatkokysymys ', jatkokysymysObj.teema, jatkokysymysObj.hakukohde);
                //suljetaan lisää jatkokysymys dialogi
                $modalInstance.dismiss('Luo_uusi_jatkokysymys');
                //avataan lisää uusi kysymys dialogit
                $scope.addQuestionAtHakukohde(jatkokysymysObj.teema, jatkokysymysObj.hakukohde)
            }



        }]);

