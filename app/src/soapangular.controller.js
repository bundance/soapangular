(function(){
    'use strict';

    angular.module('soapangularApp')
        .controller('soapangularCtrl', soapangularCtrl);

    angular.$inject = ['$scope', 'soapangular'];

    function soapangularCtrl($scope, soapangular){

        var vm = this;

        vm.soap = soapangular;

        vm.soap.post()
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