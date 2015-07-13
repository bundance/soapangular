(function(){
    'use strict';

    angular.module('angular-soap')
        .controller('angularSoapCtrl', angularSoapCtrl);

    angular.$inject = ['$scope', 'soap'];

    function angularSoapCtrl($scope, soap){

        var vm = this;

        vm.soap = soap;
        vm.url = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb6.asmx';


        soap.post()
            .then(successHandler)
            .catch(errorHandler);

        function successHandler(response){
            console.log("Subbess!")

        }

        function errorHandler(response){
            console.log("ERRO");
        }
    }
})();