import { Component } from '@angular/core';
import { UserAssistantListComponent } from '../user-assistant-list/user-assistant-list.component';
import { UserService } from '../../../core/services/user.service';
import { UserTeacher } from '../../../core/models/user.interface';
import { AddUserComponent } from "../add-user/add-user.component";
import { UsersImportComponent } from "../users-import/users-import.component";
import { SearchService } from '../../../core/services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-options',
  standalone: true,
  imports: [AddUserComponent, UsersImportComponent, FormsModule],
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.css'
})
export class UserOptionsComponent {
  searchTerm: string = '';

  constructor(private searchService: SearchService) {}

  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }
}
