'use strick';
angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('jatkokysymysSelect', [ '_', function (_) {
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
                    $scope.jatko.vastauksenJatkoKysymykset = _.without(vastauksenJatkoKysymykset, valittujatkokysymys);
                    $scope.jatkokysymysLista.push(jatko);
                };
                /**
                 * Vähennetään vastukseen liittyviä
                 * jatkokysymyksiä
                 */
                $scope.vahennaJatkoKysymys = function () {
                    $scope.jatkokysymysLista.pop();
                };

                $scope.valittuJatkoKysymys = function (valittujatkokysymys, indx) {
                    if (valittujatkokysymys !== null) {
                        valittujatkokysymys.parentId = $scope.jatko.parentId;
                        valittujatkokysymys.followupCondition = $scope.jatko.followupCondition;
                        $scope.tallennettavatJatkokysymykset.push(valittujatkokysymys);
                    }
                };
            }
        }
    }]);
