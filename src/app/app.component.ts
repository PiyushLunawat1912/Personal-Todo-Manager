import { Component } from '@angular/core';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  searchQuery: string = '';

  constructor(private todoService: TodoService) {}

  onSearchChange(query: string) {
    this.searchQuery = query;
    this.todoService.setSearchQuery(query); // Set the search query in the service
  }
}
