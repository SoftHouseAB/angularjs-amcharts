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
      templateUrl: '/frontend/amcharts/amchart.html'
    })
    .otherwise({
      redirectTo: '/todo'
    });
});
/*
var HeaderCtrl = function ($scope) {
  $scope.appDetails = {
    title : "Frontend",
    tagline : "Your new AngularJS app is now ready..."
  };
};*/
