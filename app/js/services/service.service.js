// var API = 'data/list.json';
var API = 'http://114.212.87.52:9000/app'

angular.module('nap.service')

    .factory('Services', ['$resource', '$http', function($resource, $http) {
        var services = [];

        // $http.get(API + '/projects', {}).success(function(data){
        //     tasks = data.items
        // })
        var resource = $resource(API + '/services', {}, {
            query: {
                method: 'get',
                timeout: 20000
            },
        })

        var getServices = function(name, callback) {
            return resource.query({
                'project': name
            }, function(r) {
                return callback && callback(r);
            })
        };

        return {
            // 刷新任务
            refresh: function() {
                // return tasks
                return getServices(function(response) {
                    services = response.items;
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
                services = [];
            },

            // 获取全部的任务
            getAllServices: function() {
                return services;
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
            getServices: function(key) {
                if(key == 'all') {
                    return services;
                } else {
                    var result = [];
                    var pattern = new RegExp(key,'ig');
                    for (var i = 0; i < services.length; i++) {
                        if(JSON.stringify(services[i]).match(pattern)) {
                            result.push(services[i]);
                        }
                    }
                    return result;
                }
            },

            // 按ID获取任务
            getById: function(name) {
                if (!!services) {
                    for (var i = 0; i < services.length; i++) {
                        if (services[i].name === name) {
                            return services[i];
                        }
                    }
                } else {
                    return null;
                }
            },

            // 监控任务
            monitor: function(name, callback) {
                $http({
                    method: 'GET',
                    url: API + '/services',
                    params: {
                        'project': name,
                        'limit': 20
                    }
                }).success(function(response) {
                    return callback && callback(response);
                });
            },
            //
            // // 删除任务
            // deleteTask: function(id, callback) {
            //     $http({
            //         method: 'DELETE',
            //         url: API + '/tasks/' + id
            //     }).success(function(response) {
            //         return callback && callback(response);
            //     })
            // },
            //
            // // 杀死任务
            // killTask: function(id, callback) {
            //     $http({
            //         method: 'PUT',
            //         url: API + '/tasks/' + id + '/kill'
            //     }).success(function(response) {
            //         return callback && callback(response);
            //     })
            // }
        }
    }])
