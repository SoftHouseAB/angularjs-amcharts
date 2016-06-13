/**
 * Created by jaswath on 28-05-2016.
 */
angular
  .module('charts')
  .factory('Metrics', function ($http) {
    return {
      getMetrics: function(ip, sdate, edate) {
        return $http.get('http://localhost:8080/metrics?ip='+ip+'&sdate='+sdate+'&edate='+edate).then(function(response) {
          return JSON.parse(response.data);
        }, function (error) {
          console.log(error);
          return [];
        });
      }
    };
  })
  .factory('devicesListFactory', function ($http) {
    return {
      getDevicesList: function() {
        return $http.get('http://localhost:8080/metrics/devices').then(function(response) {
          return JSON.parse(response.data);
        });
      }
    };
  })
  .controller('AmchartCtrl', function ($scope, $rootScope, $resource, $http, $q, $timeout, $filter, devicesList, Metrics) {
    'use strict';
    var pday = new Date();
    pday.setDate(pday.getDate() - 2);
    $scope.startDate = {
      value : $filter('date')(pday , "yyyy-MM-dd HH:mm")
    };
    $scope.endDate = {
      value : $filter('date')(Date.now(), "yyyy-MM-dd HH:mm"),
      max : $filter('date')(Date.now(), "yyyy-MM-dd")
    };

    $scope.IP_ADDS = devicesList;
    $scope.data = {
      sdate : $scope.startDate,
      edate : $scope.endDate,
      ipads : $scope.IP_ADDS,
      selectedip : $scope.IP_ADDS[0]
    };

    $scope.$watch('data', function (newData, oldData) {
      if (newData != oldData) {
        console.log(newData.sdate.value);
        console.log("Wait for the chart to render...");
        Metrics.getMetrics(newData.selectedip.IP_AD, newData.sdate.value, newData.edate.value).then(function (metrics) {
          $timeout(function() {
            $rootScope.$broadcast('amCharts.updateData', metrics);
          }, 500);
        });
      }
    }, true);

    $scope.amChartOptions = $timeout(function(){
      return {
        data: Metrics.getMetrics($scope.data.selectedip.IP_AD, $scope.data.sdate.value, $scope.data.edate.value).then(function (metrics) {return metrics}),
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
    }, 500);
  });
