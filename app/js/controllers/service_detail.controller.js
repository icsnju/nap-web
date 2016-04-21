'use strict';

var API = 'http://114.212.189.147:9000/app/'

var detail = angular.module('nap.service_detail',['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'chart.js', 'ui.router']);

detail.controller("mesCtrl", ['$scope', '$http', '$stateParams', 'Services',
	function($scope, $http, $stateParams, Services){
	//	console.log($stateParams.taskID);
	//	Tasks.refresh();
	//	$scope.data = Tasks.getById($stateParams.taskID);

		var service_name = $stateParams.service_name;
        var project_name = $stateParams.project;
        $scope.project_name = $stateParams.project;
        $scope.service_name = $stateParams.service_name;

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

	var service_name = $stateParams.service_name;
    var project_name = $stateParams.project;

    $scope.labels = []
    $scope.series = ['cpu']
    $scope.data = []

	setInterval(function(){
		$http.get(API + '/monitor?' + 'cmd=container&' + 'project_name=' + project_name + '&service_name=' + service_name).success(function(response) {
            $scope.labels = []
            $scope.series = ['cpu']
            $scope.data = []

            var labels = []
            var data = []
            for (var i=0; i<response.list.length && i<10; i++){
                labels.push(response.list[i]['timestamp'].split("T")[1].split(".")[0])
                data.push(response.list[i]['cpu_usage'])
            }
            $scope.series = ['cpu']
            $scope.labels = labels
            $scope.data.push(data)

        });
	},3000)
}]);

detail.controller("memCtrl", ['$scope', '$http', '$stateParams', '$interval', function ($scope, $http, $stateParams, $interval) {
    var service_name = $stateParams.service_name;
    var project_name = $stateParams.project;

    $scope.labels = []
    $scope.series = []
    $scope.data = []

	var timer = $interval(function(){
		$http.get(API + '/monitor?' + 'cmd=container&' + 'project_name=' + project_name + '&service_name=' + service_name).success(function(response) {
            $scope.labels = []
            $scope.series = ['memory']
            $scope.data = []

            var labels = []
            var data = []
            for (var i=0; i<response.list.length && i<10; i++){
                labels.push(response.list[i]['timestamp'].split("T")[1].split(".")[0])
                data.push(response.list[i]['memory_usage'])
            }
            $scope.series = ['memory']
            $scope.labels = labels
            $scope.data.push(data)

        });
	},3000)
    
    $scope.$on("$destroy", function(){
       $interval.cancel(timer); 
    });

}]);

detail.controller("logCtrl", ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
    var project_name = $stateParams.project;
    var service_name = $stateParams.service_name;
    console.log(project_name);
   $http({
       method: 'GET',
       url: API + '/log',
       params:{
           'project_name': project_name,
           'service_name': service_name
       }
   }).success(function(data){
       // $scope.log = data.logs.replace(/\r\n/, '<br>');
       $scope.log = data.logs
   });
}]);

detail.controller("yamlCtrl", ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
    // var project_name = $stateParams.project;
    // var service_name = $stateParams.service_name;
    // $http({
    //     method: 'GET',
    //     url: API + '/log',
    //     params: {
    //         'project_name': project_name,
    //         'service_name': service_name
    //     }
    // }).success(function (data) {
    //     $scope.yaml = data.logs;
    // });

    // $http.jsonp('http://114.212.189.147:8080/api/v1.2/docker/cadvisor?jsonp=JSON_CALLBACK').success(function (data){
    //     console.log(data)
    // });

}]);

detail.controller("shellCtrl", ['$scope', '$http', '$stateParams', '$sce', function($scope, $http, $stateParams, $sce) {
    var project_name = $stateParams.project;
    var service_name = $stateParams.service_name;
    var service;

    $scope.shell = "";

    $http({
        method: 'GET',
        url: API + '/service',
        params: {
            'project' : project_name,
            'service' : service_name
        }
    }).success(function(data) {
        console.log(data.item)

        if('shell' in data.item) {
            console.log(data.item.ip)
            $scope.shell = $sce.trustAsResourceUrl("http://" + data.item.ip + ":" + data.item.shell);
            // $scope.shell = $sce.trustAsResourceUrl('http://114.212.189.147:32943')
            console.log($scope.shell)
        }
    });

    console.log($scope.shell)

}]);