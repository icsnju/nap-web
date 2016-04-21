/**
 * Created by yuan on 16/4/14.
 */
var API = "http://114.212.189.147:9000/app"
angular.module('nap.add', ['ngResource', 'ui.bootstrap'])

    // 模块对话框控制器
    .controller("addCtrl", function ($scope, $http) {
        // 数据初始化

        $scope.project_name = "example";

        $http.get(API + "/network?kind=all").success(function(response){
            console.log($scope.networks)
            $scope.networks = response.list
        });

        console.log($scope.networks);

        $scope.project = [];
        var service = {
            cpus: '0.1',
            mem: '32',
            disk: '0',
            docker_image: 'busybox',
            cmd: 'ls',
            volumes: [
                {
                    container_path: "/data",
                    host_path: "/vagrant",
                    mode: "RW"
                }
            ],
            port_mappings: [
                {
                    container_port: "8000",
                    host_port: "8080",
                    protocol: "TCP"
                }
            ]
        };

        $scope.project.push(service);

        $scope.addService = function () {
            var service1 = {
                cpus: '0.1',
                mem: '32',
                disk: '0',
                docker_image: 'busybox',
                cmd: 'ls',
                volumes: [
                    {
                        container_path: "/data",
                        host_path: "/vagrant",
                        mode: "RW"
                    }
                ],
                port_mappings: [
                    {
                        container_port: "8000",
                        host_port: "8080",
                        protocol: "TCP"
                    }
                ]
            };
            
            $scope.project.push(service1);
        };

        $scope.deleteService = function (index) {
            $scope.project.splice(index, 1);
        };

        $scope.addPortMapping = function (index) {
            $scope.project[index].port_mappings.push({
                container_port: "8000",
                host_port: "8080",
                protocol: "TCP"
            })
        };

        $scope.deletePortMapping = function (index, pos) {
            $scope.project[index].port_mappings.splice(pos, 1);
        };

        $scope.addVolume = function (index) {
            $scope.project[index].volumes.push({
                container_path: "/data",
                host_path: "/vagrant",
                mode: "RW"
            })
        };

        $scope.deleteVolume = function (index, pos) {
            $scope.project[index].volumes.splice(pos, 1);
        };

        $scope.submit = function () {
            console.log($scope.select)
            if ($scope.select == 0) {
                //TODO create from table
                console.log($scope.project)
            }
            else if ($scope.select == 1) {
                console.log($scope.project_name + "    " + $scope.url)
                // Projects.submitProjectFromURL($scope.project_name, $scope.url, function(response){
                //    //TODO create from url and args
                // });
            } else {

            }
        };

    });
