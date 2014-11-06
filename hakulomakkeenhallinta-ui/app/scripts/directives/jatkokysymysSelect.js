'use strick';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('jatkokysymysSelect', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'partials/directives/jatkokysymys-select.html',
            controller: function ($scope) {
                /**
                 * Lisätään vastaukseen liittyviä
                 * jatkokysymyksiä
                 */
                $scope.plussaaJatkokysmyksia = function (valittujatkokysymys, vastauksenJatkoKysymykset) {
                    jatko.vastauksenJatkoKysymykset = _.without(vastauksenJatkoKysymykset, valittujatkokysymys);
                    $scope.jatkokysymysLista.push(jatko);
                };
                /**
                 * Vähennetään vastukseen liittyviä
                 * jatkokysymyksiä
                 */
                $scope.vahennaJatkoKysymys = function () {
                    $scope.jatkokysymysLista.pop();
                };

                /*            jatkokysymysLista [
                 {
                 vastauksenJatkoKysymykset[
                 {1, valittu jatkoK},
                 {2},
                 {3}
                 ]
                 },
                 {
                 vastauksenJatkoKysymykset[
                 {2},
                 {3}
                 ]
                 }
                 ]*/

                $scope.valittuJatkoKysymys = function (valittujatkokysymys, indx) {

                    console.log('*** index: ', indx);
                    if (valittujatkokysymys !== null) {
                        console.log('*** ', valittujatkokysymys._id);
//                    console.log('*** ', valittujatkokysymys.vastaus.id);
                        valittujatkokysymys.parentId = jatko.parentId;
                        valittujatkokysymys.condition = jatko.condition;
                        $scope.tallennettavatJatkokysymykset.push(valittujatkokysymys);
                    }
                    /*jatkokysymys.parentId = ;
                     jatkokysymys.condition = jatko.condition;*/


//                $scope.vastauksenJatkoKysymykset = _.without($scope.vastauksenJatkoKysymykset, jatkokysymys);

                    /*   for (var i = 0, hkKysL = kysymykset.length; i < hkKysL; i += 1) {
                     if (kysymykset[i]._id === jatkokysymys._id) {
                     kysymykset.splice(i,1);
                     break;
                     }
                     };

                     for (var j = 0, hkKysL2 = kysymykset.length; j < hkKysL2; j += 1) {
                     if (kysymykset[j]._id === this.valittukysymys._id) {
                     for (var o = 0, optionsL = kysymykset[j].options.length; o < optionsL; o += 1) {
                     if (kysymykset[j].options[o].id === $scope.vastaus.id) {
                     console.log('onkose vai: ',kysymykset[j].options[o].questions);
                     if (!kysymykset[j].options[o].questions) {
                     kysymykset[j].options[o].questions = [];
                     }
                     kysymykset[j].options[o].questions.push(jatkokysymys);
                     console.log(kysymykset[j].options[o]);
                     }
                     }
                     }
                     };*/

                };
            }
        }
    });
