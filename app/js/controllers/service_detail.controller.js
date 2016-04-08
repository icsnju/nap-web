'use strict';

var API = 'http://114.212.87.52:9000/app/'

var detail = angular.module('nap.service_detail',['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'chart.js', 'ui.router']);

detail.controller("mesCtrl", ['$scope', '$http', '$stateParams', 'Services',
	function($scope, $http, $stateParams, Services){
	//	console.log($stateParams.taskID);
	//	Tasks.refresh();
	//	$scope.data = Tasks.getById($stateParams.taskID);

		var service_name = $stateParams.service_name;
        var project_name = $stateParams.project;
        $scope.project_name = $stateParams.project;

        console.log('mesctrl in service detail' + project_name + service_name)

        $scope.data = {'id': ''};

		$http({
            method: 'GET',
            url: API + '/service',
            params: {
                'project' : project_name,
                'service' : service_name
            }
        }).success(function(data) {
			$scope.data = data.item;
		});
        
        $scope.short_id = function (id) {
            var rel = "";
            if(id.length <= 10)
                return id;
            for (var i=0; i<10; i++){
                rel += id[i];
            }
            return rel;
        }
        
	}
]);

detail.controller("cpuCtrl", ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {

	var service_name = $stateParams.service_name.split(".")[1];
    var project_name = $stateParams.service_name.split(".")[0];

	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
		[28, 48, 40, 19, 86, 27, 90],
		[30, 49, 40, 9, 86, 27, 90],
	];
	setInterval(function(){
		$http.get('data/status.json').success(function(data) {
			$scope.series = ['Series A', 'Series B'];
            $scope.data = [
                [65, 59, 80, 81, 56, 55, 40],
                [28, 48, 40, 19, 86, 27, 90]
			];
		});
	},10000)
}]);

detail.controller("memCtrl", function ($scope, $http) {

	$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
	$scope.series = ['Series A', 'Series B'];
	$scope.data = [
		[28, 42, 41, 19, 86, 27, 90],
		[30, 56, 40, 14, 80, 23, 91],
	];
	setInterval(function(){
		$http.get('data/status.json').success(function(data) {
			$scope.series = ['Series A', 'Series B'];
            $scope.data = [
                [65, 59, 80, 81, 56, 55, 40],
                [22, 44, 49, 12, 81, 22, 94]
			];
		});
	},10000)
});
