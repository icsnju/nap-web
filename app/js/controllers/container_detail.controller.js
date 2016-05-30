'use strict';

var API = 'http://114.212.189.147:9000/app/'

var detail = angular.module('nap.container_detail', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'chart.js', 'ui.router']);

detail.controller("mesCtrl", ['$scope', '$http', '$stateParams',
    function ($scope, $http, $stateParams) {
        //	console.log($stateParams.taskID);
        //	Tasks.refresh();
        //	$scope.data = Tasks.getById($stateParams.taskID);

        var service_name = $stateParams.service_name;
        var project_name = $stateParams.project_name;
        var container_name = $stateParams.container_name;
        $scope.project_name = $stateParams.project_name;
        $scope.service_name = $stateParams.service_name;
        $scope.container_name = $stateParams.container_name;

        $scope.data = {'id': ''};

        $http({
            method: 'GET',
            url: API + '/container',
            params: {
                'project_name': project_name,
                'service_name': service_name,
                'container_name': container_name
            }
        }).success(function (data) {
            $scope.data = data.item;
        });

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

detail.controller("cpuCtrl", ['$scope', '$http', '$stateParams', '$interval', function ($scope, $http, $stateParams, $interval) {

    var service_name = $stateParams.service_name;
    var project_name = $stateParams.project_name;
    var container_name = $stateParams.container_name;

    $scope.labels = [];
    $scope.series = ['cpu'];
    $scope.data = [];

    $http({
        method: 'GET',
        url: API + '/monitor',
        params: {
            'cmd': 'container',
            'project_name': project_name,
            'service_name': service_name,
            'container_name': container_name
        }
    }).success(function (response) {
        $scope.labels = [];
        $scope.series = ['cpu'];
        $scope.data = [];

        var labels = [];
        var data = [];
        for (var i = 0; i < response.list.length; i++) {
            labels.push(response.list[i]['timestamp'].split("T")[1].split(".")[0]);
            data.push(response.list[i]['cpu_usage']);
        }
        $scope.series = ['cpu'];
        $scope.labels = labels;
        $scope.data.push(data);
    });

    var timer = $interval(function () {
        $http({
            method: 'GET',
            url: API + '/monitor',
            params: {
                'cmd': 'container',
                'project_name': project_name,
                'service_name': service_name,
                'container_name': container_name
            }
        }).success(function (response) {
            $scope.labels = [];
            $scope.series = ['cpu'];
            $scope.data = [];

            var labels = [];
            var data = [];
            for (var i = 0; i < response.list.length; i++) {
                labels.push(response.list[i]['timestamp'].split("T")[1].split(".")[0]);
                data.push(response.list[i]['cpu_usage']);
            }
            $scope.series = ['cpu'];
            $scope.labels = labels;
            $scope.data.push(data);

        });
    }, 1000);

    $scope.$on("$destroy", function () {
        $interval.cancel(timer);
        timer = undefined;
    });

    $scope.options = {
            animation: false
        }

}]);

detail.controller("memCtrl", ['$scope', '$http', '$stateParams', '$interval', function ($scope, $http, $stateParams, $interval) {
    var service_name = $stateParams.service_name;
    var project_name = $stateParams.project_name;
    var container_name = $stateParams.container_name;

    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];

    $http({
        method: 'GET',
        url: API + '/monitor',
        params: {
            'cmd': 'container',
            'project_name': project_name,
            'service_name': service_name,
            'container_name': container_name
        }
    }).success(function (response) {
        $scope.labels = [];
        $scope.series = ['cpu'];
        $scope.data = [];

        var labels = [];
        var data = [];
        for (var i = 0; i < response.list.length; i++) {
            labels.push(response.list[i]['timestamp'].split("T")[1].split(".")[0]);
            data.push(response.list[i]['cpu_usage']);
        }
        $scope.series = ['cpu'];
        $scope.labels = labels;
        $scope.data.push(data);
    });

    var timer = $interval(function () {
        $http({
            method: 'GET',
            url: API + '/monitor',
            params: {
                'cmd': 'container',
                'project_name': project_name,
                'service_name': service_name,
                'container_name': container_name
            }
        }).success(function (response) {
            $scope.labels = [];
            $scope.series = ['memory'];
            $scope.data = [];

            var labels = [];
            var data = [];
            for (var i = 0; i < response.list.length; i++) {
                labels.push(response.list[i]['timestamp'].split("T")[1].split(".")[0]);
                data.push(response.list[i]['mem_usage']);
            }
            $scope.series = ['memory'];
            $scope.labels = labels;
            $scope.data.push(data);

        });
    }, 1000);

    $scope.$on("$destroy", function () {
        $interval.cancel(timer);
    });

    $scope.options = {
        animation: false
    }

}]);

detail.controller("logCtrl", ['$scope', '$http', '$stateParams', '$interval', function ($scope, $http, $stateParams, $interval) {
    var project_name = $stateParams.project_name;
    var service_name = $stateParams.service_name;
    var container_name = $stateParams.container_name;
    var timer = $interval(function() {
        $http({
            method: 'GET',
            url: API + '/log',
            params: {
                'project_name': project_name,
                'service_name': service_name,
                'container_name': container_name
            }
        }).success(function (data) {
            // $scope.log = data.logs.replace(/\r\n/, '<br>');
            $scope.log = data.logs
        });
    }, 3000);

    $scope.$on("$destroy", function () {
        $interval.cancel(timer);
    });

}]);

detail.controller("yamlCtrl", ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
    var project_name = $stateParams.project_name;
    $http({
        method: 'GET',
        url: API + '/yaml',
        params: {
            'project_name': project_name,
        }
    }).success(function (data) {
        $scope.yaml = data.yaml;
    });

}]);

detail.controller("shellCtrl", ['$scope', '$http', '$stateParams', '$sce', function ($scope, $http, $stateParams, $sce) {
    // var project_name = $stateParams.project_name;
    // var service_name = $stateParams.service_name;
    // var container_name = $stateParams.container_name;
    // var service;
    //
    // $scope.shell = "";
    //
    // $http({
    //     method: 'GET',
    //     url: API + '/service',
    //     params: {
    //         'project': project_name,
    //         'service': service_name
    //     }
    // }).success(function (data) {
    //
    //     if ('shell' in data.item) {
    //         $scope.shell = $sce.trustAsResourceUrl("http://" + data.item.ip + ":" + data.item.shell);
    //         // $scope.shell = $sce.trustAsResourceUrl('http://114.212.189.147:32943')
    //     }
    // });

}]);