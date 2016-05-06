/**
 * Created by yuan on 16/4/2.
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
        '$interval',
        '$mdDialog',
        '$cookies',
        'Projects',
        function ($scope, $http, $timeout, $state, $stateParams, $uibModal, $interval, $mdDialog, $cookies, Projects) {
            $scope.query = $stateParams.query || "all";
            $scope.filter = $scope.query

            // 加载数据
            var reload = function (query) {
                Projects.refresh().$promise.then(function (response) {
                    //TODO 错误处理

                    $scope.projects = Projects.getProjects(query)
                });
            };

            // 提交任务
            $scope.submitProject = function (project) {
                Projects.submitProject(project, reload($scope.query))
            };

            // 杀死任务
            $scope.kill = function (project) {
                Projects.killProject(project[0], reload($scope.query));
            };

            // 删除任务
            $scope.delete = function (project) {
                Projects.deleteProject(project[0], reload($scope.query));
                $state.go('navbar.project');
            };

            //重启任务
            $scope.restart = function (project) {
                Projects.restartProject(project[0], reload($scope.query));
            };

            // 搜索任务
            $scope.search = function () {
                $state.go('navbar.project', {query: $scope.search_key})
            };

            // 打开提交任务的模态框
            $scope.openProjectModal = function () {
                $state.go('navbar.add')
            };

            $scope.rowClick = function (project) {
                $state.go('navbar.service', {project: project});
            };

            $scope.test = function(e){
                $mdDialog.show($mdDialog.confirm()
                    .ok('ok')
                    .targetEvent(e)
                    .title('log')
                    .textContent("hello from nju ")
                )
            };

            // 加载任务, 定时监控
            reload($scope.query);
            var timer = $interval(function(){
                Projects.monitor(reload($scope.query))
            },3000);

            $scope.$on("$destroy", function() {
    	        $interval.cancel(timer);
                timer = undefined;
            })
        }]);
