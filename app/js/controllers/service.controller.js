/**
 * Created by yuan on 16/4/2.
 */

var API = 'http://114.212.189.147:9000/app'

var FILTER_NAME = ['All', 'Running', 'Finished', 'Failed', 'Killed', 'Lost', 'Staging', 'Error'];

var service_controller = angular.module('nap.service', ['ngResource', 'ui.bootstrap']);

service_controller.controller('DetailCtrl', ['$scope', '$state', '$http', '$stateParams', '$interval', 'Projects', 'Services',
    function ($scope, $state, $http, $stateParams, $interval, Projects, Services) {
        //	console.log($stateParams.taskID);
        //	Tasks.refresh();
        //	$scope.data = Tasks.getById($stateParams.taskID);
        $scope.project_name = $stateParams.project;

        $scope.query = $stateParams.query || "all";

        $http.get(API + '/projects/' + $scope.project_name)
            .success(function (response) {
                $scope.data = response.item
            });

        var timer = $interval(function () {
            $http.get(API + '/projects/' + $scope.project_name)
                .success(function (response) {
                    $scope.data = response.item
                });
        }, 3000);

        $scope.$on("$destroy", function () {
            $interval.cancel(timer);
            timer = undefined;
        });


        Services.refresh($scope.project_name).$promise.then(function (response) {
            $scope.len = Services.getServices($scope.project_name, $scope.query).length
        });

        $scope.kill = function (project) {
            Projects.killProject(project[0], reload());
        };

        $scope.restart = function (project) {
            Projects.restartProject(project[0], reload());
        };

        $scope.delete = function (project) {
            Projects.deleteProject(project[0], reload());
        };

        var reload = function () {
            $state.go('navbar.project')
        };

        // $http.get('data/ID.json').success(function(data) {
        // 	$scope.data = data.result;
        // });
    }
]);

service_controller.controller('ServiceCtrl', [
    '$scope',
    '$http',
    '$timeout',
    '$state',
    '$stateParams',
    '$uibModal',
    '$interval',
    'Services',
    function ($scope, $http, $timeout, $state, $stateParams, $uibModal, $interval, Services) {
        $scope.query = $stateParams.query || "all";
        $scope.filter = $scope.query
        var project_name = $stateParams.project.split(",")[0]

        // 加载数据
        var reload = function (query) {
            Services.refresh(project_name).$promise.then(function (response) {
                //TODO 错误处理

                $scope.services = Services.getServices(project_name, query)
            });
        };

        // 搜索任务
        $scope.search = function () {
            $state.go('service', {query: $scope.search_key})
        };

        $scope.rowClick = function (serviceID) {
            $state.go('navbar.service_detail', {project: project_name, service_name: serviceID});
        };

        $http({
            method: 'GET',
            url: API + '/services',
            params: {
                'project': project_name
            }
        }).success(function (response) {
            $scope.services = response.services;
        });

        // 加载任务, 定时监控
        reload($scope.query);
        var timer = $interval(function () {
            $http({
                method: 'GET',
                url: API + '/services',
                params: {
                    'project': project_name
                }
            }).success(function (response) {
                $scope.services = response.services;
            });
        }, 3000);

        $scope.$on("$destroy", function () {
            $interval.cancel(timer);
            timer = undefined;
        });
    }]);

service_controller.controller("PcpuCtrl", ['$scope', '$http', '$stateParams', '$interval', function ($scope, $http, $stateParams, $interval) {

    var project_name = $stateParams.project;

    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];

    $http({
            method: 'GET',
            url: API + '/services',
            params: {
                'project': project_name
            }
        }).success(function (response) {
        for (var i = 0; i < response.services.length; i++) {
            $scope.series.push(response.services[i]['name']);
        }

        console.log($scope.series);
    });

    var timer = $interval(function() {

        // $scope.series = [];
        // var series = [];
        // $http({
        //     method: 'GET',
        //     url: API + '/services',
        //     params: {
        //         'project': project_name
        //     }
        // }).success(function (response) {
        //     for(var i=0; i<response.services.length; i++){
        //         series.push(response.services[i]['name']);
        //     }
        //     console.log(series);
        //
        // console.log(series);
        // $scope.series = series;
        // console.log($scope.series);
        // console.log($scope.series.length);

        $scope.data = [];
        $scope.labels = [];

        for(var i=0; i<$scope.series.length; i++) {
            var service_name = $scope.series[i];

            $http({
                method: 'GET',
                url: API + '/monitor',
                params: {
                    'cmd': 'container',
                    'project_name': project_name,
                    'service_name': service_name
                }
            }).success(function (response) {
                var data = [];
                var labels = [];
                for (var j = 0; j < response.list.length && j < 20; j++) {
                    labels.push(response.list[j]['timestamp'].split("T")[1].split(".")[0]);
                    data.push(response.list[j]['cpu_usage']);
                }
                $scope.data.push(data);
                $scope.labels = labels;
            });
        }
        console.log($scope.data)
    }, 3000);

    $scope.$on("$destroy", function () {
        $interval.cancel(timer);
        timer = undefined;
    });

    $scope.options = {
            animation: false
        }

}]);
