(function() {
  'use strict';

  angular
    .module('d3js')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('root', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'app/shared/layout-default.html',
          },
          'header@root': {
            templateUrl: 'app/shared/navbar/navbar.tpl.html',
          }
          // ,
          // 'footer@root': {
          //   templateUrl: 'app/shared/templates/footer.tpl.html'
          // }
        },
        data: {
          requireLogin: true
        }
      })
      .state('root.home', {
        url: '/',
        data: {
          requireLogin: true
        },
        views: {
          '': {
            templateUrl: 'app/home/home.html',
            controller: 'HomeController',
            controllerAs: 'vm',
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
