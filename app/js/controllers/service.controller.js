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
        $scope.project_name = $stateParams.project_name;

        $scope.query = $stateParams.query || "all";

        $http.get(API + '/projects/' + $scope.project_name)
            .success(function (response) {
                $scope.data = response.item
            });

        var timer = $interval(function () {
            $http.get(API + '/projects/' + $scope.project_name)
                .success(function (response) {
                    $scope.data = response.item;
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
        var project_name = $stateParams.project_name.split(",")[0]

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
            $state.go('navbar.container', {project_name: project_name, service_name: serviceID});
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

    var project_name = $stateParams.project_name;

    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];

    var func = function(){
        $http({
            method: 'GET',
            url: API + '/monitor',
            params: {
                'cmd': 'project',
                'project_name': project_name
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
                $scope.series.push(each_container['name']);
                $scope.mem_series.push(each_container['name']);
                var data = [];
                var labels = [];
                var mem_data = [];
                var mem_labels = [];
                for (var j = 0; j < each_container['list'].length; j++) {
                    labels.push(each_container['list'][j]['timestamp'].split("T")[1].split(".")[0]);
                    data.push(each_container['list'][j]['cpu_usage']);
                    mem_labels.push(each_container['list'][j]['timestamp'].split("T")[1].split(".")[0]);
                    mem_data.push(each_container['list'][j]['mem_usage']);
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
