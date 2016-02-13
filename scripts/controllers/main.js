'use strict';

angular.module('todoListApp')
    .controller('MainCtrl', function ($scope, localStorageService) {

        //Default Filters
        $scope.sortType = 'title';
        $scope.reverseSort = false;

        //Default Todo type
        var Todo = function (title, description, dueDate, done) {
            this.dueDate = dueDate;
            this.title = title;
            this.description = description;
            this.done = done;
        };

        //Instance for creating a new todo
        $scope.newTodo = new Todo();

        //todos in local storage
        var todosInStorage = localStorageService.get('todos');

        //getting all todos in storate -> if null, creating new array
        $scope.todos = todosInStorage || new Array();

        //everytime $scope.todos is modified, we copy it to the local storage!
        $scope.$watch('todos', function (newValue, oldValue) {
            localStorageService.set('todos', $scope.todos);
        });

        //Simple array removal
        $scope.removeTodo = function (todo) {
            var index = $scope.todos.indexOf(todo);
            if(index != -1){
                $scope.todos.splice(index, 1);
                //updating local storage
                localStorageService.set('todos', $scope.todos);
            }

        };

        $scope.updateTodo = function(todo){
            //updating storage on updating todos
            localStorageService.set('todos', $scope.todos);
            $scope.todos = localStorageService.get('todos');
        };

        $scope.formatDate = function (dueDate) {
            if (angular.isString(dueDate)) {
                var date = dueDate.split("T")[0].split("-");
                //formatting string date from storage
                //they don't storage instances os Date()
                return date[1] + "/" + date[2] + "/" + date[0];

                //return date.join("-");
            }
        };

        $scope.openNewTodoModal = function(){
            //open modal, with outer click (outside modal) disabled
            $('#newTodo').modal({'show':true, 'backdrop': 'static'});
        };

        $scope.openEditTodoModal = function(todo){
            //same from open
            $('#editTodo').modal({'show':true, 'backdrop': 'static'});
            //copying to scope variable to edit
            $scope.editTodo = todo;
            //we need an instance of Date so we can open the html5 input date dialog
            $scope.editTodo.dueDate = new Date(todo.dueDate);
        };

        $scope.saveTodo = function () {
            if (angular.isDefined($scope.newTodo)) {
                //we verify if we have a todo instance
                //and if we have two string and a date to save
                if (angular.isString($scope.newTodo.title) &&
                    angular.isString($scope.newTodo.description) &&
                    angular.isDate($scope.newTodo.dueDate)) {
                    //putting to the scope variable
                    $scope.todos.push(new Todo($scope.newTodo.title, $scope.newTodo.description, $scope.newTodo.dueDate, false));
                    //saving to storage
                    localStorageService.set('todos', $scope.todos);
                    //syncing scope to local storage
                    $scope.todos = localStorageService.get('todos');

                    //cleaning scope variable
                    $scope.newTodo = new Todo(undefined, undefined,undefined,undefined);
                }

            }
        };

        $scope.syncTodo = function(){
            localStorageService.set('todos', $scope.todos);
            $scope.todos = localStorageService.get('todos');
        };

    });
