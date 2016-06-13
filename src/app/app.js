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
<<<<<<< HEAD
      templateUrl: '/frontend/amcharts/amchart.html',
      resolve: {
        devicesList: function(devicesListFactory) {
          return devicesListFactory.getDevicesList();
        }
      }
=======
      templateUrl: '/frontend/amcharts/amchart.html'
>>>>>>> 9e245c562f643c8eeb68154acb578700e523a9fa
    })
    .otherwise({
      redirectTo: '/todo'
    });
});
<<<<<<< HEAD
=======
/*
var HeaderCtrl = function ($scope) {
  $scope.appDetails = {
    title : "Frontend",
    tagline : "Your new AngularJS app is now ready..."
  };
};*/
>>>>>>> 9e245c562f643c8eeb68154acb578700e523a9fa
