'use strict';

angular.module('nap.auth')

    .controller('LoginController',
        ['$scope', '$rootScope', '$state', '$http', '$cookies', 'AuthenticationService',
            function ($scope, $rootScope, $state, $http, $cookies, AuthenticationService) {
                // reset login status
                var API = "http://114.212.189.147:9000"
                AuthenticationService.ClearCredentials();

                $scope.login = function () {
                    $http({
                        method: 'POST',
                        url: API + '/auth',
                        data: {
                            'username': $scope.username,
                            'password': $scope.password,
                        },
                    }).success(function (response) {
                        $cookies.remove('token');
                        $cookies.put('token', response.token);
                        $http.defaults.headers.common['Authorization'] = 'Token ' + response.token;
                        $state.go('navbar.project');
                    }).error(function (response) {
                        $scope.error = "username or password is wrong";
                    });
                    // $scope.dataLoading = true;
                    // AuthenticationService.Login($scope.username, $scope.password, function (response) {
                    //     if (response.success) {
                    //         AuthenticationService.SetCredentials($scope.username, $scope.password);
                    //         $state.go('navbar.project');
                    //     } else {
                    //         $scope.error = response.message;
                    //         $scope.dataLoading = false;
                    //     }
                    // });
                };
            }]);
