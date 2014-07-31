'use strict';
 angular.module('hakulomakkeenhallintaUiApp.controllers')
     .controller('addRuleCtrl', function($scope, $modalInstance, hkKysymysLista, $filter) {


         $scope.hkKysymysLista = $filter('filter')(hkKysymysLista,
             function (hkKysymysLista) {
                if (hkKysymysLista.type === 'RadioButton' || hkKysymysLista.type === 'CheckBox'){
                    return true;
                }
                 return false;
         });

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
             $modalInstance.close('tallenna');
         };

         $scope.cancel = function () {
             $modalInstance.dismiss('cancel');
         };

         $scope.valittuKysymys = function () {
             console.log('##', this.valittukysymys._id);
             var valKysymys = this.valittukysymys;
             $scope.jatkoKysymykset = $filter('filter')(hkKysymysLista,
                function(hkKysymysList){
                    if(valKysymys._id === hkKysymysList._id){
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
         }

         $scope.vahennaVastaus = function () {
             $scope.vastauksia.pop();

             console.log($scope.vastauksia);
         }

         $scope.lisaaJatkoKysymys = function () {
             var jatko = {};
             jatko._id = $scope.jatkokysymysLista.length;
             $scope.jatkokysymysLista.push(jatko);
         }

         $scope.vahennaJatkoKysymys = function () {
             $scope.jatkokysymysLista.pop();
         }
});

