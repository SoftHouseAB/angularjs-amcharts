angular.module('frontend', [
  'ngRoute',
  'ngResource',
  'ngProgress',
  'charts',
  'device',
  'frontend.todo'
])
.run(function($rootScope, ngProgressFactory) {
  $rootScope.progressbar = ngProgressFactory.createInstance();
  $rootScope.$on('$routeChangeStart', function(ev,data) {
    $rootScope.progressbar.start();
  });
  $rootScope.$on('$routeChangeSuccess', function(ev,data) {
    $rootScope.progressbar.complete();
  });
})
.config(function ($routeProvider) {
  'use strict';

  $routeProvider
    .when('/todo', {
      controller: 'TodoCtrl',
      templateUrl: '/frontend/todo/todo.html'
    })
    .when('/amcharts', {
      controller: 'AmchartCtrl',
      templateUrl: '/frontend/amcharts/amchart.html',
      resolve: {
        devicesList: function(devicesListFactory) {
          return devicesListFactory.getDevicesList();
        }
      }
    })
    .when('/devices', {
      controller: 'DeviceCtrl',
      templateUrl: '/frontend/devices/devices.html',
      resolve: {
        metricsList: function(metricsListFactory) {
          return metricsListFactory.getMetricsList();
        }
      }
    })
    .otherwise({
      redirectTo: '/todo'
    });
});
