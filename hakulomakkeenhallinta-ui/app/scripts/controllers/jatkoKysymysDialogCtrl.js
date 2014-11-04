'use strict';
 angular.module('hakulomakkeenhallintaUiApp.controllers')
     .controller('jatkoKysymysDialogCtrl', [ '$scope', '$modalInstance', 'jatkokysymysObj', '$filter', 'JatkokysymysService',
          function ($scope, $modalInstance, jatkokysymysObj, $filter, JatkokysymysService) {

         /*$scope.hkKysymysLista = $filter('filter')(hkKysymysLista,
             function (hkKysymysLista) {
                if (hkKysymysLista.type === 'RadioButton' || hkKysymysLista.type === 'CheckBox'){
                    return true;
                }
                 return false;
         });*/

         console.log('### \n', jatkokysymysObj, '\n ####');
         $scope.hkKysymysLista = jatkokysymysObj.kysymykset;

         $scope.jatkoKysymykset = [];
         $scope.vastauksia = [];
         var vastaus = {};
            vastaus.id = 'option_0';
         $scope.vastauksia.push(vastaus);

         $scope.jatkokysymysLista = [];
         var jatko = {};
             jatko._id = 'muuta tamä';
         $scope.jatkokysymysLista.push(jatko);


         $scope.tallennaSaanto = function () {
             console.log('GGGG ',jatkokysymysObj.kysymykset);
             JatkokysymysService.setJatkokysymysObj(undefined);
             $modalInstance.close(jatkokysymysObj.kysymykset);

         };

         $scope.cancel = function () {
             JatkokysymysService.setJatkokysymysObj(undefined);
             $modalInstance.dismiss('cancel');
         };
         console.log('23545 question ',jatkokysymysObj.kysymys);
         console.log('23545 option', jatkokysymysObj.vastaus);
         if (jatkokysymysObj.kysymys !== undefined) {
             $scope.valittuKysymys = jatkokysymysObj.kysymys;
         }


         $scope.valittuKysymys = function () {
             console.log('##', this.valittukysymys._id);
             var valKysymys = this.valittukysymys;
             $scope.jatkoKysymykset = $filter('filter')(jatkokysymysObj.kysymykset,
                function (jatkokysymysObj.kysymykset) {
                    if (valKysymys._id === jatkokysymysObj.kysymykset._id) {
                        return false;
                    }
                    return true;
                });
         };

         $scope.lisaaVastaus = function () {

             var vastaus = {};
                vastaus.id = 'option_' + $scope.vastauksia.length;
             $scope.vastauksia.push(vastaus);
             console.log($scope.vastauksia);
         };

         $scope.vahennaVastaus = function () {
             $scope.vastauksia.pop();
             console.log($scope.vastauksia);
         };

         $scope.lisaaJatkoKysymys = function () {
             var jatko = {};
             jatko._id = $scope.jatkokysymysLista.length;
             $scope.jatkokysymysLista.push(jatko);

         };
        $scope.vastaus;
        $scope.saanto;
         $scope.valittuVastaus = function (vastaus) {
             $scope.vastaus = vastaus;
         };

         $scope.valittuSaanto = function (saanto) {
             $scope.saanto = saanto;
         };
         $scope.vahennaJatkoKysymys = function () {
             $scope.jatkokysymysLista.pop();
         };

         $scope.valittuJatkoKysymys = function (jatkokysymys) {
             console.log('*** ',jatkokysymys._id);
             console.log('*** ', $scope.vastaus.id);
             console.log('*** ', $scope.saanto);
             jatkokysymys.parentId = this.valittukysymys._id;
             jatkokysymys.optionId = $scope.vastaus.id;
            for (var i = 0, hkKysL = jatkokysymysObj.kysymykset.length; i < hkKysL; i += 1) {
                if (jatkokysymysObj.kysymykset[i]._id === jatkokysymys._id) {
                    jatkokysymysObj.kysymykset.splice(i,1);
                    break;
                }
            };

             for (var j = 0, hkKysL2 = jatkokysymysObj.kysymykset.length; j < hkKysL2; j += 1) {
                 if (jatkokysymysObj.kysymykset[j]._id === this.valittukysymys._id) {
                        for (var o = 0, optionsL = jatkokysymysObj.kysymykset[j].options.length; o < optionsL; o += 1) {
                            if (jatkokysymysObj.kysymykset[j].options[o].id === $scope.vastaus.id) {
                                console.log('onkose vai: ',jatkokysymysObj.kysymykset[j].options[o].questions);
                                if (!jatkokysymysObj.kysymykset[j].options[o].questions) {
                                    jatkokysymysObj.kysymykset[j].options[o].questions = [];
                                }
                                jatkokysymysObj.kysymykset[j].options[o].questions.push(jatkokysymys);
                                console.log(jatkokysymysObj.kysymykset[j].options[o]);
                            }
                        }
                 }
             };

         };

         $scope.lisaaUusiKysymysFromJatkokysymys = function () {
             console.log('## ', 'Lisää uus kysymys', jatkokysymysObj.kysymykset);
             console.log('## ', 'Lisää uus kysymys', jatkokysymysObj.teema, jatkokysymysObj.hakukohde);
//             $modalInstance.close(hkKysymysLista);

             $modalInstance.dismiss('lisaa uusi kysymys');
             $scope.addQuestionAtHakukohde(jatkokysymysObj.teema, jatkokysymysObj.hakukohde, jatkokysymysObj)
         }



}]);

