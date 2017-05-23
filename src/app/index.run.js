(function() {
  'use strict';

  angular
    .module('d3js')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
