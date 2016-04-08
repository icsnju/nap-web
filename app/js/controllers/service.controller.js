/**
 * Created by jeff on 16/3/9.
 */

var API = 'http://114.212.87.52:9000/app'

var FILTER_NAME = ['All', 'Running', 'Finished', 'Failed', 'Killed', 'Lost', 'Staging', 'Error'];

var service_controller = angular.module('nap.service', ['ngResource', 'ui.bootstrap']);

service_controller.controller('DetailCtrl', ['$scope', '$http', '$stateParams', 'Services',
	function($scope, $http, $stateParams, Services){
	//	console.log($stateParams.taskID);
	//	Tasks.refresh();
	//	$scope.data = Tasks.getById($stateParams.taskID);
        $scope.project_name = $stateParams.project;

        var query = $stateParams.query || "all";

        console.log("detail project name: " + $scope.project_name)
        console.log($stateParams.project)

        $scope.data = $http.get(API + '/projects/' + $scope.project_name)
            .success(function(response){
                $scope.data = response.item
            })

        // Services.refresh(project_name).$promise.then(function(response) {
        //     $scope.len = Services.getServices(project_name, query).length
        // })

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
    'Services',
function($scope, $http, $timeout, $state, $stateParams, $uibModal, Services) {
    $scope.query = $stateParams.query || "all";
    $scope.filter = $scope.query
    var project_name = $stateParams.project.split(",")[0]

    // 加载数据
    var reload = function (query) {
        Services.refresh(project_name).$promise.then(function(response) {
            //TODO 错误处理

            $scope.services = Services.getServices(project_name, query)
        });
    }

    // 搜索任务
    $scope.search = function () {
        $state.go('service', {query: $scope.search_key})
    }

    $scope.rowClick = function(serviceID){
        console.log('goto service_detail')
		$state.go('navbar.service_detail',{service_name: project_name + "." + serviceID});
	};

    // 加载任务, 定时监控
    reload($scope.query);
    // setInterval(function(){
    //     console.warn("interval project name: " + project_name)
    //     Services.monitor(project_name, reload($scope.query))
    // },10000)
}]);

