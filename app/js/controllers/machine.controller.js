'use strict';
var API = "114.212.87.52:9000/app"
var overview = angular.module("nap.machine", ["chart.js"]);

overview.controller("machineCtrl", function ($scope, $http, $interval) {

    $scope.cpu_labels = ['cpu usage', 'cpu remain'];
    $scope.memory_labels = ['memory usage', 'memory remain'];
    $scope.filesystem_labels = ['filesystem usage', 'filesystem total'];

    var timer = $interval(function(){
        $http.get(API + "/monitor?cmd=" + "machine").success(function (response) {
            $scope.data = response.list

            console.log("here")
            var cpu_usage = 0;
            var memory_usage = 0;
            var memory_total = 0;
            var filesystem_usage = 0;
            var filesystem_total = 0;

            for (var j = 0; j < $scope.data.length; j++) {

                var node = $scope.data[j];

                cpu_usage += node['cpu_usage'];
                memory_usage += node['memory_usage'];
                memory_total += node['memory_total'];
                filesystem_usage += node['filesystem_usage'];
                filesystem_total += node['filesystem_total'];

                // for (var i = 0; i < node['filesystem'].length; i++) {
                //     filesystem_usage += node['filesystem'][i]['filesystem_usage'];
                //     filesystem_total += node['filesystem'][i]['filesystem_total'];
                // }
            }

            cpu_usage = cpu_usage / $scope.data.length;

            $scope.cpu_data = [cpu_usage, 1 - cpu_usage];
            $scope.memory_data = [memory_usage, memory_total - memory_usage];
            $scope.filesystem_data = [filesystem_usage, filesystem_total - filesystem_usage];

        })
    }, 3000);

    $scope.$on("$destroy", function() {
    	$interval.cancel(timer);
        timer = undefined;
    })
});
