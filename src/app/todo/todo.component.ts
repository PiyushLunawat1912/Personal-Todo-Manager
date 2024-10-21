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
  todos: Todo[] = []; // Changed from any[] to Todo[]
  title: string = '';
  searchQuery: string = ''; // Added property for search query

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    // Load saved todos from localStorage
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }

    // Subscribe to search query changes
    this.todoService.searchQuery$.subscribe(query => {
      this.searchQuery = query; // Update the search query
    });
  }

  addTodo() {
    if (this.title.trim()) { // Check if title is not empty
      const newTodo: Todo = {
        id: this.todos.length + 1,
        title: this.title,
        completed: false,
      };
      this.todos.push(newTodo);
      this.title = '';
      this.saveTodos();
    }
  }

  editTodo(todo: Todo) {
    this.title = todo.title;
    const index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
    this.saveTodos();
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

  // Filter todos based on search query
  get filteredTodos(): Todo[] {
    return this.todos.filter(todo =>
      todo.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
