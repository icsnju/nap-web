/**
 * Created by jeff on 16/3/9.
 */

var FILTER_NAME = ['All', 'Running', 'Finished', 'Failed', 'Killed', 'Lost', 'Staging', 'Error'];

var service_controller = angular.module('nap.service', ['ngResource', 'ui.bootstrap']);

service_controller.controller('DetailCtrl', ['$scope', '$http', '$stateParams', 'Projects',
	function($scope, $http, $stateParams, Projects){
	//	console.log($stateParams.taskID);
	//	Tasks.refresh();
	//	$scope.data = Tasks.getById($stateParams.taskID);
        var project_name = $stateParams.project_name;

        console.log("detail project name: " + project_name)

        $http.get('data/ID.json').success(function(data) {
			$scope.data = data.result;
		});
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
    var project_name = $stateParams.project_name

    console.warn("service ctrl project name: " + project_name)
    // 加载数据
    var reload = function (query) {
        Services.refresh().$promise.then(function(response) {
            //TODO 错误处理

            console.log(project_name)

            $scope.services = Services.getServices(project_name, query)
            console.log($scope.services)
        });
    }

    // 搜索任务
    $scope.search = function () {
        $state.go('service', {query: $scope.search_key})
    }

    $scope.rowClick = function(serviceID){
		$state.go('navbar.service_detail',{service_name: serviceID});
	};

    // 加载任务, 定时监控
    reload($scope.query);
    setInterval(function(){
        console.warn("interval project name: " + project_name)
        Services.monitor(project_name, reload($scope.query))
    },10000)   
}]);

