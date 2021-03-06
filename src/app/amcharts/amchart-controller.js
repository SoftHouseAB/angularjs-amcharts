/**
 * Created by jaswath on 28-05-2016.
 */
angular
  .module('charts')
  .factory('Metrics', function ($http, HOST_DOMAIN) {
    return {
      getMetrics: function(ip, sdate, edate) {
        var multiple_IP = [];
        ip.forEach(function (tempIP) {
          multiple_IP.push(tempIP.IP_AD);
        })
        return $http.get(HOST_DOMAIN+'/metrics?ip='+multiple_IP+'&sdate='+sdate+'&edate='+edate).then(function(response) {
          console.log(response.data);
          return JSON.parse(response.data);
        }, function (error) {
          console.log(error);
          return [];
        });
      }
    };
  })
  .factory('devicesListFactory', function ($http, HOST_DOMAIN) {
    return {
      getDevicesList: function() {
        return $http.get(HOST_DOMAIN+'/metrics/devices').then(function(response) {
            return JSON.parse(response.data);
          }, function (error) {
          console.log(error);
          return [];
        });
        }
    };
  })
  .controller('AmchartCtrl', function ($scope, $rootScope, $http, $timeout, $filter, devicesList, Metrics) {
    'use strict';
    var pday = new Date();
    pday.setDate(pday.getDate() - 2);
    $scope.IP_ADDS = devicesList;
    $scope.metricsType = ["CPU Usage", "Memory Usage", "Network Input", "Network Output"];
    $scope.loader = true;
    $scope.data = {
      sdate : {
        value : $filter('date')(pday , "yyyy-MM-dd HH:mm")
      },
      edate : {
        value : $filter('date')(Date.now(), "yyyy-MM-dd HH:mm"),
        max : $filter('date')(Date.now(), "yyyy-MM-dd")
      },
      ipads : $scope.IP_ADDS,
      selectedip : [$scope.IP_ADDS[0]],
      metricTypes: $scope.metricsType,
      selectedType:$scope.metricsType[0]
    };

    $scope.$watch('data', function (newData, oldData) {
      if (newData != oldData) {
        $scope.loader = true;
        console.log("Wait for the chart to render...");
        if (newData.selectedip.length == 0) {
          $timeout(function() {
            $rootScope.$broadcast('amCharts.updateData', []);
          }, 500);
        }
        else {
          if (newData.selectedType != oldData.selectedType) {
            $scope.newChartOptions = $scope.amChartOptions.then(function (result) {
              result.valueAxes[0].title = newData.selectedType;
              $rootScope.$broadcast('amCharts.renderChart', result);
              //console.log(result);
            });
          }
          Metrics.getMetrics(newData.selectedip, newData.sdate.value, newData.edate.value).then(function (metrics) {
              $timeout(function () {
                $rootScope.$broadcast('amCharts.updateData', massageData(metrics, newData.selectedType));
              }, 500);
          });
        }
      }
    }, true);

    // Christian's code for formating the data
    function massageData(metrics, selectedMetric) {
      var array = [];
      metrics.forEach(function (metric) { array = array.concat(metric.metrics)})
      //var realMetrics = metrics.map(function(metric) {return metric.metrics});
      var data = {};
      array.forEach(function (m) {
        if(!data[m.DATE_AND_TIME]) {
          data[m.DATE_AND_TIME] = {}
        }
        data[m.DATE_AND_TIME]['time'] = m.DATE_AND_TIME;
        if (selectedMetric == "CPU Usage") { data[m.DATE_AND_TIME][m.IP_AD] = m.CPU_USAGE }
        else if (selectedMetric == "Memory Usage") { data[m.DATE_AND_TIME][m.IP_AD] = m.MEMORY }
        else if (selectedMetric == "Network Input") { data[m.DATE_AND_TIME][m.IP_AD] = m.NETWORK_IN }
        else if (selectedMetric == "Network Output") { data[m.DATE_AND_TIME][m.IP_AD] = m.NETWORK_OUT }
        else {console.log("Something wrong!");}
      });
      var realData = Object.keys(data).map(function(key) { return data[key]});
      $scope.loader = false;
      return realData;
    }

    var graphs = [];
    $scope.IP_ADDS.forEach(function (ip) {
      graphs.push({
        type: "line",
        bullet: "round",
        title: ip.IP_AD,
        valueField: ip.IP_AD,
        fillAlphas: 0
      })
    });

    $scope.amChartOptions = $timeout(function(){
      return {
        data: Metrics.getMetrics($scope.data.selectedip, $scope.data.sdate.value, $scope.data.edate.value).then(function (metrics) {
              return massageData(metrics, $scope.data.selectedType);
        }),
        type: "serial",
        categoryField: "time",
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
          title: $scope.data.selectedType
        }],
        graphs: graphs
      }
    }, 500);
  });
