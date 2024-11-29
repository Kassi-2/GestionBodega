import { Component } from '@angular/core';
import { UsersImportComponent } from '../users-import/users-import.component';
import { SearchService } from '../../../core/services/search.service';
import { FormsModule } from '@angular/forms';
import { UserAddComponent } from '../user-add/user-add.component';
import { RouterLink } from '@angular/router';
import { UserSendQrComponent } from '../user-send-qr/user-send-qr.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-options',
  standalone: true,
  imports: [UserAddComponent, UsersImportComponent, FormsModule, RouterLink, UserSendQrComponent, CommonModule
  ],
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.css',
})
export class UserOptionsComponent {
  searchTerm: string = '';
  selectedCategory: string = 'students';

  constructor(private searchService: SearchService) {}
  /**
   * Función que enía al servicio el término de búsqueda que ingresó el usuario para listar los usuarios que coincidan con lo ingresado.
   *
   * @memberof UserOptionsComponent
   */
  onSearch() {
    this.searchService.updateSearchTerm(this.searchTerm);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }
}
