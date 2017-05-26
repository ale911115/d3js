(function () {
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
        views: {
          '': {
            templateUrl: 'app/d3js/d3js-list.html',
            controller: 'D3JSController',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.d3js.linechart', {
        url: '/linechart',
        views: {
          '': {
            templateUrl: 'app/d3js/line-chart/d3js-line-chart.html',
            controller: 'D3JSLineChartController',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.d3js.scalingdata', {
        url: '/scalingdata',
        views: {
          '': {
            templateUrl: 'app/d3js/scaling-data/d3js-scaling-data.html',
            controller: 'D3JSScalingDataController',
            controllerAs: 'vm'
          }
        }
      })
      .state('root.d3js.axis', {
        url: '/axis',
        views: {
          '': {
            templateUrl: 'app/d3js/axis/d3js-axis.html',
            controller: 'D3JSAxisController',
            controllerAs: 'vm'
          }
        }
      });


    $urlRouterProvider.otherwise('/');
  }

})();
