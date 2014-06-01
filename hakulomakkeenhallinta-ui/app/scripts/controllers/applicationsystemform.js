'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('ApplicationSystemFormCtrl', ['$scope', '$routeParams', 'ASForms', '$modal', '_',
        function($scope, $routeParams, ASForms, $modal, _) {
            console.log('****** ApplicationSystemFormCtrl ****');
            $scope.applicationSystem = ASForms.get({ '_id': $routeParams.id });

            $scope.delete = function(array, index) {
                array.splice(index, 0);
            };

            $scope.selectTemplate = function(type) {
                var t = type.split('.').pop();
                if (t === 'Theme' ||  t === 'RelatedQuestionComplexRule') {
                    return t;
                }
                return "element";
            };

            $scope.expr2str = function(expr) {
                if (expr._class) {
                    var oper = expr._class.split('.').pop();
                    if (oper == 'Variable') {
                        return expr.value;
                    } else if (oper == 'Value') {
                        return '\'' + expr.value + '\'';
                    } else if (oper == 'Not') {
                        return ' (' + oper.toLowerCase() + ' ' + this.expr2str(expr.left) + ")";
                    } else if (oper == 'Equals') {
                        return '(' + this.expr2str(expr.left) + ' = ' + this.expr2str(expr.right) + ')';
                    } else if (oper == 'Or') {
                        return '(' + this.expr2str(expr.left) + ' tai ' + this.expr2str(expr.right) + ')';
                    } else if (oper == 'And') {
                        return '(' + this.expr2str(expr.left) + ' ja ' + this.expr2str(expr.right) + ')';
                    } else if (oper == 'Regexp') {
                        return '\'' + expr.value + '=' + expr.pattern + '\'';
                    }

                    return "Unimplemented operator " + oper;
                } else {
                    return '';
                }
            };

            $scope.addQuestion = function(tree){
                console.log('####', tree);
            }

            $scope.tallenna = function(){
                ASForms.update($scope.applicationSystem);
            }
        }
    ]);
