'use strict';

var API = 'http://114.212.189.147:9000/app/'

var detail = angular.module('nap.container', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'chart.js', 'ui.router']);

detail.controller("CmesCtrl", ['$scope', '$http', '$stateParams',
    function ($scope, $http, $stateParams) {
        //	console.log($stateParams.taskID);
        //	Tasks.refresh();
        //	$scope.data = Tasks.getById($stateParams.taskID);

        var service_name = $stateParams.service_name;
        var project_name = $stateParams.project_name;
        $scope.project_name = $stateParams.project_name;
        $scope.service_name = $stateParams.service_name;

        $http({
            method: 'GET',
            url: API + '/service',
            params: {
                'project': project_name,
                'service': service_name
            }
        }).success(function (data) {
            $scope.data = data.item[0];
        });

    }
]);

detail.controller("ContainerListCtrl", ['$scope', '$http', '$stateParams', '$interval', '$state',
    function ($scope, $http, $stateParams, $interval, $state) {
        //	console.log($stateParams.taskID);
        //	Tasks.refresh();
        //	$scope.data = Tasks.getById($stateParams.taskID);

        var service_name = $stateParams.service_name;
        var project_name = $stateParams.project_name;
        $scope.project_name = $stateParams.project_name;
        $scope.service_name = $stateParams.service_name;

        var func = function () {
            $http({
                method: 'GET',
                url: API + '/containers',
                params: {
                    'project_name': project_name,
                    'service_name': service_name
                }
            }).success(function (data) {
                $scope.containers = data.item;
            });
        };

        // func();

        var timer = $interval(func, 1000);

        $scope.$on("$destroy", function () {
            $interval.cancel(timer);
            timer = undefined;
        });

        $scope.rowClick = function (container_name) {

            $state.go('navbar.container_detail', {
                project_name: $scope.project_name,
                service_name: $scope.service_name,
                container_name: container_name
            })

        };

        $scope.short_id = function (id) {
            var rel = "";
            if (id.length <= 10)
                return id;
            for (var i = 0; i < 10; i++) {
                rel += id[i];
            }
            return rel;
        }

    }
]);

detail.controller("ScpuCtrl", ['$scope', '$http', '$stateParams', '$interval', function ($scope, $http, $stateParams, $interval) {

    var service_name = $stateParams.service_name;
    var project_name = $stateParams.project_name;

    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];
    $scope.mem_labels = [];
    $scope.mem_series = [];
    $scope.mem_data = [];

    var func = function(){
        $http({
            method: 'GET',
            url: API + '/monitor',
            params: {
                'cmd': 'service',
                'project_name': project_name,
                'service_name': service_name
            }
        }).success(function (response) {
            $scope.labels = [];
            $scope.series = [];
            $scope.data = [];
            $scope.mem_labels = [];
            $scope.mem_series = [];
            $scope.mem_data = [];

            for (var i = 0; i < response.item.length; i++) {
                var each_container = response.item[i];
                $scope.series.push(each_container['name'])
                $scope.mem_series.push(each_container['name'])
                var data = [];
                var labels = [];
                var mem_data = [];
                var mem_labels = [];
                for (var j = 0; j < each_container['list'].length; j++) {
                    labels.push(each_container['list'][j]['timestamp'].split("T")[1].split(".")[0]);
                    data.push(each_container['list'][j]['cpu_usage'])
                    mem_labels.push(each_container['list'][j]['timestamp'].split("T")[1].split(".")[0]);
                    mem_data.push(each_container['list'][j]['mem_usage'])
                }
                $scope.labels = labels;
                $scope.data.push(data);
                $scope.mem_labels = mem_labels;
                $scope.mem_data.push(mem_data);
            }

        });
    };

    var timer = $interval(func, 1000);

    $scope.$on("$destroy", function () {
        $interval.cancel(timer);
        timer = undefined;
    });

    $scope.options = {
        animation: false
    }

}]);
