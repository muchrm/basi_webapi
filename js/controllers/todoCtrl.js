/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc').controller('TodoCtrl', function TodoCtrl($scope, $routeParams, todoStorage, $filter) {
	'use strict';
	var todos = $scope.todos = [];
	todoStorage.get().success(function (todos) {
		$scope.todos = todos;
	}).error(function (error) {
		alert('Failed to load TODOs');
	});
	$scope.newTodo = '';
	$scope.editedTodo = null;

	$scope.$watch('todos', function () {
		$scope.remainingCount = $filter('filter')($scope.todos, { completed: false }).length;
		$scope.completedCount = $scope.todos.length - $scope.remainingCount;
		$scope.allChecked = !$scope.remainingCount;
	}, true);

	// Monitor the current route for changes and adjust the filter accordingly.
	$scope.$on('$routeChangeSuccess', function () {
		var status = $scope.status = $routeParams.status || '';
		$scope.statusFilter = (status === 'active') ?
			{ completed: false } : (status === 'completed') ?
				{ completed: true } : {};
	});

	$scope.addTodo = function () {
		var newTitle = $scope.newTodo.trim();
		if (!newTitle.length) {
			return;
		}
		var newTodo = {
			title: newTitle,
			completed: false
		}
		todoStorage.create(newTodo).success(function (savedTodo) {
			$scope.todos.push(savedTodo);
		}).error(function (error) {
			alert('Failed to save the new TODO');
		});
		$scope.newTodo = '';
	};

	
	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};

	$scope.saveEdits = function (todo, $event) {
		// Blur events are automatically triggered after the form submit event.
		// This does some unfortunate logic handling to prevent saving twice.
		if (event === 'blur' && $scope.saveEvent === 'submit') {
			$scope.saveEvent = null;
			return;
		}

		$scope.saveEvent = event;

		if ($scope.reverted) {
			// Todo edits were reverted-- don't save.
			$scope.reverted = null;
			return;
		}

		todo.title = todo.title.trim();
		if ((todo._saving !== true) && ($scope.originalTodo.title !== todo.title)) {
			todo._saving = true; // submit and blur trigger this method. Let's save the document just once
			todoStorage.update(todo).success(function (newTodo) {
				if (newTodo === 'null') { // Compare with a string because of https://github.com/angular/angular.js/issues/2973
					console.log('hum');
					$scope.todos.splice($scope.todos.indexOf(todo), 1);
				}
				else {
					$scope.todos[$scope.todos.indexOf(todo)] = newTodo;
					$scope.editedTodo = null;
				}
			}).error(function () {
				todo._saving = false;
				alert('Failed to update this TODO');
			});
		}
		else {
			$scope.editedTodo = null;
		}
	};

	$scope.revertEdits = function (todo) {
		$scope.todos[$scope.todos.indexOf(todo)] = $scope.originalTodo;
		$scope.doneEditing($scope.originalTodo);
	};

	$scope.removeTodo = function (todo) {
		todoStorage.delete(todo.id).success(function () {
			$scope.todos.splice($scope.todos.indexOf(todo), 1);
		}).error(function () {
			alert('Failed to delete this TODO');
		});
	};

	$scope.clearCompletedTodos = function () {
		$scope.todos.forEach(function (todo) {
			if (todo.completed) {
				$scope.removeTodo(todo);
			}
		});
	};
	$scope.toggleCompleted = function (todo,completed) {
		var copyTodo = angular.extend({}, todo);
		if (angular.isDefined(completed)) {
				copyTodo.completed = completed
			}
		todoStorage.update(copyTodo).success(function (newTodo) {
			if (newTodo === 'null') { // Compare with a string because of https://github.com/angular/angular.js/issues/2973
				$scope.todos.splice($scope.todos.indexOf(todo), 1);
			}
			else {
				$scope.todos[$scope.todos.indexOf(todo)] = newTodo;
				$scope.editedTodo = null;
			}
		}).error(function () {
			console.log('fds');
			alert('Failed to update the status of this TODO');
		});

	};
	$scope.markAll = function (completed) {
		$scope.todos.forEach(function (todo) {
			if (todo.completed !== !completed) {
				$scope.toggleTodo(todo);
			}
			//todo.completed = !completed;
		});
	};
});