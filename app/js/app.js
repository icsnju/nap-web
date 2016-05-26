'use strict';

// Declare app level module which depends on views, and components
angular.module('nap', [
        'ui.router',
        'nap.project',
        'nap.service',
        'nap.container',
        'nap.container_detail',
        'nap.machine',
        'nap.add',
        'nap.auth',
        'ngRoute',
        'ngCookies'
    ])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                templateUrl: "/app/js/templates/login.html",
                controller: 'LoginController'
            }).state("navbar", {
                templateUrl: "/app/js/templates/navbar.html"
            })
            .state("navbar.project", {
                url: "/project?query",
                templateUrl: "/app/js/templates/project.html",
                controller: 'ProjectCtrl'
            }).state("navbar.service", {
                url: "/project/:project_name",
                templateUrl: "/app/js/templates/service.html",
                controller: ''
            }).state("navbar.add", {
                url: "/add",
                templateUrl: "/app/js/templates/add.html",
                controller: 'addCtrl'
            }).state("navbar.container", {
                url: "/project/:project_name/:service_name",
                templateUrl: "/app/js/templates/container.html",
                controller: ''
            }).state("navbar.container_detail", {
                url: "/project/:project_name/:service_name/:container_name",
                templateUrl: "/app/js/templates/container_detail.html",
                controller: ''
            })
            .state("navbar.machine", {
                url: "/machine",
                templateUrl: "/app/js/templates/machine.html",
                controller: 'machineCtrl'
            });
        //$locationProvider.html5Mode({enabled:true, requireBase:false});
        $locationProvider.html5Mode({enabled: true});
        $urlRouterProvider.otherwise('/login');
    }])

    .run(['$rootScope', '$state', '$cookies', '$http', '$window',
        function ($rootScope, $state, $cookies, $http, $window) {
            // keep user logged in after page refresh
            $rootScope.globals = $cookies.get('token') || false;
            if ($rootScope.globals) {
                $http.defaults.headers.common['Authorization'] = 'Token ' + $rootScope.globals;
            }

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                // redirect to login page if not logged in
                if (toState.name !== 'login' && !$rootScope.globals) {
                    event.preventDefault();
                    $state.go('login');
                }
            });

            // $rootScope.onExit = function(){
            //     $cookies.remove('token');
            // };
            //$window.onbeforeunload = $rootScope.onExit;
        }]);
