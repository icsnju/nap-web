'use strict';

// Declare app level module which depends on views, and components
angular.module('nap', [
        'ui.router',
        'nap.project',
        'nap.service',
        'nap.service_detail',
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
                url: "/project/:project",
                templateUrl: "/app/js/templates/service.html",
                controller: ''
            }).state("navbar.add", {
                url: "/add",
                templateUrl: "/app/js/templates/add.html",
                controller: 'addCtrl'
            }).state("navbar.service_detail", {
                url: "/project/:project/:service_name",
                templateUrl: "/app/js/templates/service_detail.html",
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

    .run(['$rootScope', '$state', '$cookieStore', '$http',
        function ($rootScope, $state, $cookieStore, $http) {
            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            if ($rootScope.globals.currentUser) {
                //    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; 
            }

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                // redirect to login page if not logged in
                if (toState.name !== 'login' && !$rootScope.globals.currentUser) {
                    event.preventDefault();
                    $state.go('login');
                }
            });
        }]);
