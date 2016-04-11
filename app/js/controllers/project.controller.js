/**
 * Created by jeff on 16/3/9.
 */

var FILTER_NAME = ['All', 'Running', 'Finished', 'Failed', 'Killed', 'Lost', 'Staging', 'Error'];

angular.module('nap.project', ['ngResource', 'ui.bootstrap'])

.controller('ProjectCtrl', [
    '$scope',
    '$http',
    '$timeout',
    '$state',
    '$stateParams',
    '$uibModal',
    'Projects',
function($scope, $http, $timeout, $state, $stateParams, $uibModal, Projects) {
    $scope.query = $stateParams.query || "all";
    $scope.filter = $scope.query
	
    // 加载数据
    var reload = function (query) {
        Projects.refresh().$promise.then(function(response) {
            //TODO 错误处理
            
            $scope.projects = Projects.getProjects(query)
        });
    }

    // 提交任务
    $scope.submitProject = function (project) {
        Projects.submitProject(project, reload($scope.query))
    }

    // 杀死任务
    $scope.kill = function (project) {
        Projects.killProject(project[0], reload($scope.query));
    }

    // 删除任务
    $scope.delete = function (project) {
        Projects.deleteProject(project[0], reload($scope.query));
    }
    
    //重启任务
    $scope.restart = function(project){
        Projects.restartProject(project[0], reload($scope.query));
    }

    // 搜索任务
    $scope.search = function () {
        console.log($scope.search_key)
        $state.go('navbar.project', {query: $scope.search_key})
    }

    // 打开提交任务的模态框
    $scope.openProjectModal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/app/js/templates/project.modal.html',
            controller: ProjectModalCtrl,
            size: 'md',
            windowTemplateUrl: '/app/js/components/modal/modal.window.html',
            resolve: {

            }
        });
    }
    
    $scope.rowClick = function(project){
        console.warn("project project name: " + project)
		$state.go('navbar.service',{project: project});
	};

    // 加载任务, 定时监控
    reload($scope.query);
    // setInterval(function(){
    //     Projects.monitor(reload($scope.query))
    // },10000)
}]);


// 模块对话框控制器
var ProjectModalCtrl = function ($scope, $uibModalInstance, Projects) {
    // 数据初始化
    $scope.task = {
        cpus:'0.1',
        mem:'32',
        disk:'0',
        docker_image:'busybox',
        cmd:'ls',
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
    }

    $scope.addPortMapping = function() {
        $scope.task.port_mappings.push({
            container_port: "8000",
                host_port: "8080",
            protocol: "TCP"
        })
    }

    $scope.deletePortMapping = function(index) {
        $scope.task.port_mappings.splice(index, 1);
    }

    $scope.addVolume = function() {
        $scope.task.volumes.push({
            container_path: "/data",
            host_path: "/vagrant",
            mode: "RW"
        })
    }

    $scope.deleteVolume = function(index) {
        $scope.task.volumes.splice(index, 1);
    }

    $scope.submit = function () {
        console.log($scope.select)
        if($scope.select == 0){
            Projects.submitProjectFromTable($scope.task, function(response){
               //TODO create from table
            });
        }
        else if($scope.select == 1){
              console.log($scope.project_name + "    " + $scope.url)
            // Projects.submitProjectFromURL($scope.project_name, $scope.url, function(response){
            //    //TODO create from url and args
            // });
        }else{

        }
        // Projects.submitProject($scope.task, function(){
        //     // TODO 消息通知
        // });
        // $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
};
