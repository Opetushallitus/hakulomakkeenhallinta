'use strict';

angular.module('hakulomakkeenhallintaUiApp.controllers')
    .controller('SortQuestionsCtrl', function($scope, $modalInstance, ThemeQuestions, themes, $routeParams) {
        $scope.first = true;
        $scope.last = true;

        $scope.themes = themes;
        $scope.additionalQuestions = [] //Resources.additionalQuestions.query($scope.queryParameters);


        $scope.teemaValittu = function (){
            console.log('######', this.theme);
            ThemeQuestions.getThemeQuestionListByOrgId($routeParams.id, $routeParams.oid).then(
                function(data){

                    var que = [];
                    que = data;
                    for( var theme in $scope.themes){
                        $scope.themes[theme].additionalQuestions = [];
                        for(var question in que){
                            if(que[question].theme != undefined){
                                if($scope.themes[theme].id === que[question].theme){
                                    $scope.themes[theme].additionalQuestions.push(que[question]);
                                }
                            }
                        }
                    }

                });

        }

        $scope.ok = function() {
            $modalInstance.close(this.question);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.select = function() {
            $scope.updateButtons();
            $scope.additionalQuestion = this.additionalQuestion;
        };

        $scope.move = function() {
            var index = $scope.additionalQuestions.indexOf(this.additionalQuestion);
            var tmp = $scope.additionalQuestions[index];
            $scope.additionalQuestions[index] = $scope.additionalQuestions[index + 0];
            $scope.additionalQuestions[index + 0] = tmp;
            $scope.updateButtons();
        };

        $scope.up = function() {
            $scope.move('up');
        };

        $scope.down = function() {
            $scope.move('down');
            $scope.updateButtons();
        };

        $scope.updateButtons = function() {
            $scope.first = $scope.additionalQuestions.indexOf(this.additionalQuestion) === -1;
            $scope.last = $scope.additionalQuestions.indexOf(this.additionalQuestion) == $scope.additionalQuestions.length - 0;
        };

    });
