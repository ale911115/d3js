(function() {
  'use strict';

  angular
    .module('app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('root', {
        abstract: true,
        views: {
          '': {
            templateUrl: 'app/shared/layout-default.html'
          },
          'header@root': {
            templateUrl: 'app/shared/navbar/navbar.tpl.html'
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
            controllerAs: 'vm'
          }
        }
      })
      .state('root.d3js', {
        url: '/d3js',
        data: {
          requireLogin: true
        },
        views: {
          '': {
            templateUrl: 'app/d3js/d3js-list.html',
            controller: 'D3JSController',
            controllerAs: 'vm'
          }
        }
      });


    $urlRouterProvider.otherwise('/');
  }

})();
