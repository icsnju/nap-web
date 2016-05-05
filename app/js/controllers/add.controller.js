/**
 * Created by yuan on 16/4/14.
 */
var API = "http://114.212.189.147:9000/app"
angular.module('nap.add', ['ngResource', 'ui.bootstrap'])

    // 模块对话框控制器
    .controller("addCtrl", function ($scope, $http, $state, $mdDialog) {
        // 数据初始化

        $scope.project_name = "example";

        $http.get(API + "/network?kind=all").success(function (response) {
            $scope.networks = response.list;
        });

        $scope.project = [];
        var service = {
            name: 'service0',
            cpu_shares: '1024',
            mem_limit: '32m',
            disk: '0',
            image: 'busybox',
            command: 'ls',
            volumes: [
                {
                    container_path: "/data",
                    host_path: "/vagrant",
                    mode: "rw"
                }
            ],
            ports: [
                {
                    container_port: "8000",
                    host_port: "8080",
                    protocol: "tcp"
                }
            ]
        };

        $scope.project.push(service);

        $scope.addService = function () {
            var service1 = {
                name: 'service' + $scope.project.length,
                cpu_shares: '1024',
                mem_limit: '32m',
                disk: '0',
                image: 'busybox',
                command: 'ls',
                volumes: [
                    {
                        container_path: "/data",
                        host_path: "/vagrant",
                        mode: "rw"
                    }
                ],
                port_mappings: [
                    {
                        container_port: "8000",
                        host_port: "8080",
                        protocol: "tcp"
                    }
                ]
            };

            $scope.project.push(service1);
        };

        $scope.deleteService = function (index) {
            $scope.project.splice(index, 1);
        };

        $scope.addPortMapping = function (index) {
            $scope.project[index].ports.push({
                container_port: "8000",
                host_port: "8080",
                protocol: "tcp"
            })
        };

        $scope.deletePortMapping = function (index, pos) {
            $scope.project[index].ports.splice(pos, 1);
        };

        $scope.addVolume = function (index) {
            $scope.project[index].volumes.push({
                container_path: "/data",
                host_path: "/vagrant",
                mode: "rw"
            })
        };

        $scope.deleteVolume = function (index, pos) {
            $scope.project[index].volumes.splice(pos, 1);
        };

        $scope.submit = function (e) {
            if ($scope.select == 0) {
                //TODO create from table
                console.log($scope.project);
                $http({
                    method: 'POST',
                    url: API + '/projects',
                    data: {
                        'cmd': 'table',
                        'project_name': $scope.project_name,
                        'table': $scope.project
                    }
                }).success(function (response) {
                    $mdDialog.show($mdDialog.confirm()
                        .ok('ok')
                        .targetEvent(e)
                        .title('log')
                        .textContent(response.log)
                    );
                })
            }
            else if ($scope.select == 1) {
                $http({
                    method: 'POST',
                    url: API + '/projects',
                    data: {
                        'cmd': 'url',
                        'project_name': $scope.project_name,
                        'url': $scope.url
                    },
                }).success(function (response) {
                    $mdDialog.show($mdDialog.confirm()
                        .ok('ok')
                        .targetEvent(e)
                        .title('log')
                        .textContent(response.log)
                    );
                }).error(function (response) {
                    console.log(response)
                });
            } else {

            }
            $state.go('navbar.project');
        };

    });
