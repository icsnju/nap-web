// var API = 'data/list.json';
var API = 'http://114.212.189.147:9000/app'

angular.module('nap.project')

    .factory('Projects', ['$resource', '$http', function($resource, $http) {
        var projects = [];

        // $http.get(API + '/projects', {}).success(function(data){
        //     tasks = data.items
        // })
        var resource = $resource(API + '/projects', {}, {
            query: {
                method: 'get',
                timeout: 20000
            },
        })

        var getProjects = function(callback) {
            return resource.query({
                'start': 0,
                'limit': 20
            }, function(r) {
                return callback && callback(r);
            })
        };

        return {
            // 刷新任务
            refresh: function() {
                // return projects
                return getProjects(function(response) {
                    projects = response.items;
                    // for(var i = 0; i < tasks.length; i++) {
                    //     switch (parseInt(tasks[i].state)) {
                    //         case 0:
                    //             tasks[i].status="STARTING";
                    //             tasks[i].label_class="info";
                    //             break;
                    //         case 1:
                    //             tasks[i].status="RUNNING";
                    //             tasks[i].label_class="info";
                    //             break;
                    //         case 2:
                    //             tasks[i].status="FINISHED";
                    //             tasks[i].label_class="success";
                    //             break;
                    //         case 3:
                    //             tasks[i].status="FAILED";
                    //             tasks[i].label_class="danger";
                    //             break;
                    //         case 4:
                    //             tasks[i].status="KILLED";
                    //             tasks[i].label_class="warning";
                    //             break;
                    //         case 5:
                    //             tasks[i].status="LOST";
                    //             tasks[i].label_class="default";
                    //             break;
                    //         case 6:
                    //             tasks[i].status="STAGING";
                    //             tasks[i].label_class="primary";
                    //             break;
                    //     }
                    // }
                    // tasks.sort(function(a, b) {
                    //     return b.create_time - a.create_time;
                    // })
                })
            },

            // 重置数据
            resetData: function() {
                projects = [];
            },

            // 获取全部的任务
            getAllProjects: function() {
                return projects;
            },

            // 获取指定状态的任务
            //getTasks: function(state) {
            //    if(state === "0") {
            //        return tasks;
            //    } else {
            //        var result = [];
            //        for (var i = 0; i < tasks.length; i++) {
            //            if(tasks[i].state === state) {
            //                result.push(tasks[i]);
            //            }
            //        }
            //        return result;
            //    }
            //},

            // 搜索任务
            getProjects: function(key) {
                if(key == 'all') {
                    return projects;
                } else {
                    var result = [];
                    var pattern = new RegExp(key,'ig');
                    for (var i = 0; i < projects.length; i++) {
                        if(JSON.stringify(projects[i]).match(pattern)) {
                            result.push(projects[i]);
                        }
                    }
                    return result;
                }
            },

            // 按name获取任务
            getById: function(name) {
                if (!!projects) {
                    for (var i = 0; i < projects.length; i++) {
                        if (projects[i][0] === name) {
                            return projects[i];
                        }
                    }
                } else {
                    return null;
                }
            },

            submitProjectFromURL: function(project_name, url, callback) {
                $http({
                    method: 'POST',
                    url: API + '/projects',
                    data: {
                        'cmd': 'url',
                        'project_name': project_name,
                        'url': url
                    }
                }).success(function (response) {
                    return callback(response);
                });
            },

            submitProjectFromTable: function(project, callback) {
                $http({
                    method: 'POST',
                    url: API + '/projects',
                    data:{
                        'cmd': 'table',
                        'project_name': project.name,
                        'services': project
                    }
                }).success(function (response) {
                    return callback(response);
                });
            },
            
            // 监控任务
            monitor: function(callback) {
                $http({
                    method: 'GET',
                    url: API + '/projects',
                    params: {
                        'start': 0,
                        'limit': 20
                    }
                }).success(function(response) {
                    return callback && callback(response);
                });
            },

            // 删除任务
            deleteProject: function(project_name, callback) {
                $http({
                    method: 'DELETE',
                    url: API + '/projects/' + project_name,
                }).success(function(response) {
                    return callback && callback(response);
                })
            },

            // 杀死任务
            killProject: function(id, callback) {
                $http({
                    method: 'PUT',
                    url: API + '/projects',
                    data:{
                        'cmd': 'kill',
                        'project_name': id
                    }
                }).success(function(response) {
                    return callback && callback(response);
                })
            },
            
            // 重启任务
            restartProject: function (id, callback) {
                $http({
                    method: 'PUT',
                    url: API + '/projects',
                    data:{
                        'cmd': 'restart',
                        'project_name': id
                    }
                }).success(function (response) {
                    return callback && callback(response);
                })
                
            }
        }
    }])
