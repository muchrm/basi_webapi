/**
 * Services that persists and retrieves TODOs from localStorage
 */
angular.module('todomvc').factory('todoStorage', function ($http) {
  'use strict';
  var url = 'http://localhost:8080/todos/'
  return {
    get: function () {
      return $http.get(url+'get_todos');
    },
    create: function (todo) {
      return $http.post(url+'add_todo', todo);
    },
    update: function (todo) {
      return $http.post(url+'update_todo/'+todo.id, todo);
    },
    delete: function(id) {
      return $http.get(url+'delete_todo/'+id);
    }
  };
});
