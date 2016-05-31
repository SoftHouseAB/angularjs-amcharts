/**
 * Created by jaswath on 28-05-2016.
 */
angular
  .module('charts')
  .controller('AmchartCtrl', function ($scope, $resource, $http, $q, $timeout) {
    'use strict';

    $scope.dataFromPromise = function(){
      var deferred = $q.defer();
      $http.get('http://localhost:8080/metrics').then(function(response) {
        $scope.jsonData = JSON.parse(response.data);
        deferred.resolve($scope.jsonData);
      });
      return deferred.promise;
    };
    $scope.amChartOptions = $timeout(function(){
      console.log($scope.dataFromPromise());
      return {
        data: $scope.dataFromPromise(),
        type: "serial",
        categoryField: "DATE_AND_TIME",
        rotate: false,
        legend: {
          enabled: true
        },
        chartScrollbar: {
          enabled: true
        },
        categoryAxis: {
          title: "Date",
          gridPosition: "start",
          parseDates: true,
          minPeriod: "hh"
        },
        valueAxes: [{
          position: "left",
          title: "CPU Usage"
        }],
        graphs: [{
          type: "line",
          bullet: "round",
          title: "Server Metrics",
          valueField: "CPU_USAGE",
          fillAlphas: 0
        }]
      }
    }, 1000);
  });
