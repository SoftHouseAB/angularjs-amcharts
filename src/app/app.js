angular.module('frontend', [
  'ngRoute',
  'ngResource',
  'charts',
  'frontend.todo'
])
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
    .otherwise({
      redirectTo: '/todo'
    });
});
