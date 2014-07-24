'use strict';

angular.module('hakulomakkeenhallintaUiApp.directives')
    .directive('hakukohdeLisakysmykset',[ 'TarjontaAPI', function (TarjontaAPI) {
        return {
            restrict: 'E',
            replace: true,
            template:'<div>'+
                '<h4 data-ng-click=\"toggleNaytaHakukohdeKysymykset()\"><a>{{ hakukohdeInfo.hakukohteenNimi }} : {{ hakukohdeInfo.tarjoajaNimet.fi }}'+
                '<i class=\"glyphicon\" ng-class=\"{\'glyphicon-chevron-down\': hakukohdeQues, \'glyphicon-chevron-right\': !hakukohdeQues }\"></i></a> </h4>'+
                '<div class="form-group">'+
                '<button type=\"button\" class=\"btn\" data-ng-click=\"sortQuestions()\" data-ng-show="naytaHakukohdeQues">Järjestä kysymykset</button>'+
                '<button type=\"button\" class=\"btn\" data-ng-click=\"addRule()" data-ng-disabled=\"!addRule\" data-ng-show="naytaHakukohdeQues">  Lisää sääntö</button>'+
                 '</div></div>',
            link: function (scope, element, attrs) {
                TarjontaAPI.fetchHakukohdeInfo(attrs.aoid).then(function(data){
                    scope.hakukohdeInfo = data;
                });

                scope.naytaHakukohdeQues = false;
                scope.toggleNaytaHakukohdeKysymykset = function(){
                    scope.naytaHakukohdeQues = !scope.naytaHakukohdeQues;
                }
            }
        }
    }]);

