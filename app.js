var todoList = {
    todos: [],
    addTodo: function (todoText) {
        this.todos.push({
            todoText: todoText,
            completed: false
        });
        this.saveTodos();
        return this.todos;
    },
    changeTodos: function (position, newValue) {
        this.todos[position].todoText = newValue;
        this.saveTodos();
        return this.todos;
    },
    toggleTodo: function (position) {
        this.todos[position].completed = !this.todos[position].completed;
        this.saveTodos();
        return this.todos;
    },
    deleteTodo: function (position) {
        this.todos.splice(position, 1);
        this.saveTodos();
        return this.todos;
    },
    deleteAllTodos: function () {
        this.todos = [];
        this.saveTodos();
        return this.todos;
    },
    toggleAll: function () {
        if (this.todos.every(element => element.completed === true)) {
            this.todos.forEach(element => element.completed = false);
        }
        else {
            this.todos.forEach(element => element.completed = true);
        }
        this.saveTodos();
        return this.todos;
    },
    getTodos: function () {
        var todos = JSON.parse(localStorage.getItem('todos'));
        if (todo === null) {
            todos = [];
        }
        this.todos = todos;
        return this.todos;
    },
    saveTodos: function () {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
};

var handlers = {
    initialise: function () {
        views.setUpEventListeners();
        var array = todoList.getTodos();
        views.drawTodos(array);
    },
    addTodo: function (text) {
        var array = todoList.addTodo(text);
        views.drawTodos(array);
    },
    changeTodo: function (position, text) {
        var array = todoList.changeTodos(position, text);
        views.drawTodos(array);
    },
    toggleTodo: function (position) {
        var array = todoList.toggleTodo(position);
        views.drawTodos(array);
    },
    deleteTodo: function (position) {
        var array = todoList.deleteTodo(position);
        views.drawTodos(array);
    },
    deleteAllTodos: function () {
        var array = todoList.deleteAllTodos();
        views.drawTodos(array);
    },
    toggleAllTodos: function () {
        var array = todoList.toggleAll();
        views.drawTodos(array);
    },
    redrawTodos: function() {
        var array = todoList.getTodos();
        views.drawTodos(array);
    }
};

var views = {
    drawTodos: function (array) {
        // Remove currenet li elements.
        var list = document.getElementById('todoList');
        list.innerHTML = '';
        // Hide elements if no todos, if not redraw todos.
        if (todoList.todos.length === 0) {
            views.displayControls(false);
        }
        else {
            array.forEach(function (element, index) {
                //     // Create DOM Element
                var listItem = document.createElement('li');
                listItem.id = index;

                list.append(listItem);
                listItem.append(views.createCheckBox(element.completed));
                listItem.append(views.createParagraph(element.todoText, element.completed));
                listItem.append(views.createDeleteButton());
            })
            //Ensure relevant elements are displayed.
            views.displayControls(true);
        }
    },
    displayControls: function(boolean) {
        if (boolean === true) { 
            document.getElementById('controls').style.display = 'flex';
            document.getElementById('todoList').style.display = 'block';
        }
        else {
            document.getElementById('controls').style.display = 'none';
            document.getElementById('todoList').style.display = 'none';
        }
    },
    createCheckBox: function (completed) {
        var checkBox = document.createElement('input');
        var checkMark = document.createElement('span');
        var label = document.createElement('label');

        checkBox.setAttribute('type', 'checkbox');
        checkBox.classList.add('checkbox');
        checkMark.classList.add('checkmark');

        label.append(checkBox);
        label.append(checkMark);

        if (completed === true) {
            checkBox.checked = true;
        }

        return label;
    },
    createParagraph: function (text, completed) {
        var paragraph = document.createElement('p');
        paragraph.innerText = text;
        if (completed === true) {
            paragraph.classList.add('completed');
        }
        return paragraph;
    },
    createDeleteButton: function () {
        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'X';
        return deleteButton;
    },
    createEditBox: function (text) {
        var editBox = document.createElement('input');
        editBox.classList.add('todoItemEdit');
        editBox.value = text;

        return editBox;
    },
    setUpEventListeners: function () {
        // Attach onclick and onkeypress events
        document.getElementById('deleteAll').onclick = function () { handlers.deleteAllTodos(); };
        document.getElementById('toggleAll').onclick = function () { handlers.toggleAllTodos(); };
        todoInput = document.getElementById('todoInput');
        todoInput.onkeypress = function (e) {
            if (e.keyCode == 13) {
                if (todoInput.value != "") {
                    handlers.addTodo(todoInput.value);
                    todoInput.value = '';
                }
            }
        };
        todoUL = document.getElementById('todoList');
        todoUL.onclick = function (e) {
            var element = e.target;
            if (element.localName === 'button') {
                handlers.deleteTodo(element.parentElement.id);
            }
        }
        todoUL.onchange = function(e) {
            var element = e.target;
            if (element.type === 'checkbox') {
                handlers.toggleTodo(element.parentElement.parentElement.id);
            }
        }
        todoUL.ondblclick = function(e) {
            var element = e.target;
            if (element.localName === 'p') {
                var editBox = views.createEditBox(element.innerText);
                element.parentNode.replaceChild(editBox, element);
                editBox.focus();
                editBox.onblur = function() {
                    editBox.remove();
                    handlers.redrawTodos();
                }
            }
        }
        todoUL.onkeypress = function(e) {
            var element = e.target;
            if (element.type === 'text') {
                if (e.keyCode === 13) {
                    handlers.changeTodo(element.parentElement.id, element.value);
                }
            }
        }
    }
};

document.onload = handlers.initialise();
