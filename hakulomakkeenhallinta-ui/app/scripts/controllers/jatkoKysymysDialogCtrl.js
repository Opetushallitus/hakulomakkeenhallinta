'use strict';
angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('jatkoKysymysDialogCtrl', [ '$scope', '$modalInstance', '$filter', 'JatkokysymysService', '_',
        function ($scope, $modalInstance, $filter, JatkokysymysService, _) {

            var jatkokysymysObj = JatkokysymysService.getJatkokysymysObj(),
                kysymykset = jatkokysymysObj.kysymykset;

            $scope.kysymykset = _.filter(kysymykset, function (k) { if (k.type === 'RadioButton' || k.type === 'CheckBox') { return k; } });
            $scope.valittukysymys = jatkokysymysObj.kysymys;
            $scope.vastaus = jatkokysymysObj.vastaus;
            $scope.vastauksenJatkoKysymykset = _.without(kysymykset, jatkokysymysObj.kysymys);

//            console.log('### \n', jatkokysymysObj, '\n ####');
            console.log('### kysymys: ', jatkokysymysObj.kysymys);
            console.log('### vastaus: ', jatkokysymysObj.vastaus);

            $scope.tallennettavatJatkokysymykset = [];
            $scope.jatkokysymysLista = [];

            $scope.jatko = {};
            $scope.jatko.parentId = $scope.valittukysymys._id;
            $scope.jatko.followupCondition = '';
//            $scope.jatko.vastauksenJatkoKysymykset = $scope.vastauksenJatkoKysymykset;
            if ($scope.vastaus !== undefined) {
                $scope.jatko.followupCondition = $scope.vastaus.id;
            }

            $scope.jatkokysymysLista.push($scope.jatko);
            /**
             * Tallentaa jatkokysymykset valittuu
             * kysymyksen vastaukseen
             */
//            $scope.tallennaJatkokysymykset = function () {
//                console.log('Tallentaan jatkokysymykset -->',kysymykset);
//                //TODO: tähän jatkokysmysten tallennus kun bacend tukee sitä
//                $modalInstance.close(kysymykset);
//            };
            /**
             * Suljetaan jatkokysymys dialogi
             */
            $scope.cancel = function () {
                JatkokysymysService.setJatkokysymysObj(undefined);
                JatkokysymysService.setParentQuestion(undefined);
                $modalInstance.dismiss('cancel');
            };
            /**
             * asetetaa valittu kysymys johon jatkokysymykset
             * liitetään
             * valitun kysymyksen suhteen
             */
            $scope.valittuKysymys = function () {
                $scope.vastaus = null;
                $scope.jatko.followupCondition = '';
                if (this.valittukysymys !== null) {
                    $scope.vastauksenJatkoKysymykset = _.without(kysymykset, this.valittukysymys);
                    $scope.jatko.parentId = this.valittukysymys._id;
                } else {
                    $scope.jatko.parentId = '';
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
                    $scope.jatko.followupCondition = vastaus.id;
                } else {
                    $scope.jatko.followupCondition = '';
                }
            };

            /**
             * Luodaan uusi jatkokysymys
             */
            $scope.luoJatkokysymys = function () {
                console.log('## ', 'Luo uusi jatkokysymys ', jatkokysymysObj.kysymykset);
                console.log('## ', 'Luo uusi jatkokysymys ', jatkokysymysObj.teema, jatkokysymysObj.hakukohde);
                //suljetaan lisää jatkokysymys dialogi
                console.log('Luo_uusi_jatkokysymys', $scope.jatko);
                JatkokysymysService.setParentQuestion($scope.jatko);
                $modalInstance.dismiss('Luo_uusi_jatkokysymys');
                //avataan lisää uusi kysymys dialogit
                $scope.addQuestionAtHakukohde(jatkokysymysObj.teema, jatkokysymysObj.hakukohde);
            }



        }]);

