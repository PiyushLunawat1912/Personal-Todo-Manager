import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todos: Todo[] = [];
  title: string = '';
  searchQuery: string = '';
  editingTodo: Todo | null = null; // Added variable to track the todo being edited

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }

    this.todoService.searchQuery$.subscribe(query => {
      this.searchQuery = query;
    });
  }

  addTodo() {
    if (this.title.trim()) {
      if (this.editingTodo) {
        // Update the existing todo in edit mode
        this.editingTodo.title = this.title;
        this.editingTodo = null; // Reset editing mode
      } else {
        // Add new todo if not in edit mode
        const newTodo: Todo = {
          id: this.todos.length ? Math.max(...this.todos.map(t => t.id)) + 1 : 1,
          title: this.title,
          completed: false,
        };
        this.todos.push(newTodo);
      }
      this.title = '';
      this.saveTodos();
    }
  }

  editTodo(todo: Todo) {
    this.title = todo.title;
    this.editingTodo = todo; // Set the current todo to be edited
  }

  deleteTodo(todo: Todo) {
    const index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
    this.saveTodos();
  }

  onCheckboxClick(todo: Todo) {
    todo.completed = !todo.completed;
    this.saveTodos();
  }

  private saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  get filteredTodos(): Todo[] {
    return this.todos.filter(todo =>
      todo.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
