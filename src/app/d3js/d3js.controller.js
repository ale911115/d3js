(function() {
'use strict';

    angular
        .module('app')
        .controller('D3JSController', D3JSController);

    D3JSController.inject = [];
    function D3JSController() {
        var vm = this;
        vm.title = "D3.js is awesome!"

        activate();

        ////////////////

        function activate() { }
    }
})();