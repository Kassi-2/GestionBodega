import { Component } from '@angular/core';
import { UsersImportComponent } from '../users-import/users-import.component';
import { SearchService } from '../../../core/services/search.service';
import { FormsModule } from '@angular/forms';
import { UserAddComponent } from '../user-add/user-add.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-options',
  standalone: true,
  imports: [UserAddComponent, UsersImportComponent, FormsModule, RouterLink],
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.css',
})
export class UserOptionsComponent {
  searchTerm: string = '';

  constructor(private searchService: SearchService) {}
  /**
   * Función que enía al servicio el término de búsqueda que ingresó el usuario para listar los usuarios que coincidan con lo ingresado.
   *
   * @memberof UserOptionsComponent
   */
  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }
}
